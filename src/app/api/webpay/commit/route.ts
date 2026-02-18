
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { webpayCommit } from '@/lib/transbank';
import { sendPieWebhook, sendInstallmentWebhook } from '@/lib/webhooks';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get('token_ws'); // Success
    const tbkToken = searchParams.get('TBK_TOKEN'); // Aborted
    const scope = searchParams.get('scope') || 'RESERVATION'; // Default to RESERVATION

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aliminlomasdelmar.com';

    // Handle aborted payment
    if (tbkToken && !token) {
        return NextResponse.redirect(`${baseUrl}/pago-fallo?token=${tbkToken}`);
    }

    if (!token) {
        return NextResponse.redirect(`${baseUrl}/pago-fallo?error=missing_token`);
    }

    try {
        // 1. Commit transaction with Transbank
        const commitResponse = await webpayCommit(token);

        // 2. Find transaction in DB
        const transaction = await prisma.webpayTransaction.findUnique({
            where: { token },
            include: { reservation: true }
        });

        if (!transaction) {
            console.error("Transaction not found for token:", token);
            return NextResponse.redirect(`${baseUrl}/pago-fallo?error=transaction_not_found`);
        }

        // 3. Update Transaction Record
        const status = commitResponse.status === 'AUTHORIZED' && commitResponse.response_code === 0 ? 'AUTHORIZED' : 'FAILED';

        await prisma.webpayTransaction.update({
            where: { token },
            data: {
                status: status,
                response_code: commitResponse.response_code,
                authorization_code: commitResponse.authorization_code,
                // @ts-ignore
                payment_type_code: commitResponse.payment_type_code,
                // @ts-ignore
                installments_number: commitResponse.installments_number,
                transaction_date: new Date(commitResponse.transaction_date),
                processed_at: new Date()
            }
        });

        if (status === 'AUTHORIZED') {
            const reservationId = transaction.reservation_id;
            let userId = transaction.reservation.buyer_id;

            // Determine Scope from DB (more reliable) or fallback to URL
            const scope = transaction.scope || searchParams.get('scope') || 'RESERVATION';
            console.log(`[Webpay Commit] Token: ${token}, Scope: ${scope}, Status: ${status}`);

            // --- USER CREATION / LINKING LOGIC ---
            if (!userId && transaction.reservation.email) {
                const email = transaction.reservation.email;
                const name = transaction.reservation.name || 'Usuario';

                // Check if user exists
                let user = await prisma.user.findUnique({ where: { email } });
                let isNewUser = false;

                if (!user) {
                    isNewUser = true;
                    // Create new user
                    const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                    const hashedPassword = await bcrypt.hash(randomPassword, 10);

                    user = await prisma.user.create({
                        data: {
                            name,
                            email,
                            password: hashedPassword,
                            role: Role.USER,
                            emailVerified: new Date(), // Auto-verify since they paid
                            mustChangePassword: true   // Force them to change the temp password
                        }
                    });

                    // Trigger Registration Webhook (New User)
                    // URL provided by user for Temp Password email:
                    const registerWebhookUrl = "https://n8n-n8n.yszha2.easypanel.host/webhook/7febf5b8-27dd-4988-b137-364480bcba58";

                    try {
                        // Fire and forget
                        fetch(registerWebhookUrl, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                email: user.email,
                                name: user.name,
                                temp_password: randomPassword,
                                login_url: `${baseUrl}/login`,
                                dashboard_url: `${baseUrl}/user/plots`,
                                rut: transaction.reservation.rut,
                                phone: transaction.reservation.phone
                            }),
                        }).catch(e => console.error("Failed to trigger register webhook", e));

                    } catch (e) {
                        console.error("Error preparing new user webhook", e);
                    }
                }

                if (user) {
                    userId = user.id;
                    // Link user to reservation
                    await prisma.reservation.update({
                        where: { id: reservationId },
                        data: { buyer_id: userId }
                    });
                }
            }
            // -------------------------------------

            // --- UPDATE RESERVATION/LOT STATUS ---
            if (scope === 'PIE') {
                await prisma.reservation.update({
                    where: { id: reservationId },
                    data: {
                        // @ts-ignore
                        pie_status: 'PAID',
                        pipeline_stage: 'PIE_PAGADO'
                    }
                });
            } else if (scope === 'INSTALLMENT') {
                await prisma.reservation.update({
                    where: { id: reservationId },
                    data: {
                        // @ts-ignore
                        installments_paid: {
                            // @ts-ignore
                            increment: transaction.installments_count || 0
                        },
                        pipeline_stage: 'PAGO_CUOTAS'
                    }
                });
            } else {
                // RESERVATION (Standard flow)
                await prisma.reservation.update({
                    where: { id: reservationId },
                    data: {
                        status: 'paid',
                        pipeline_stage: 'RESERVA_PAGADA',
                        // Ensure buyer_id is set if we found/created user
                        ...(userId ? { buyer_id: userId } : {})
                    }
                });

                if (transaction.lot_id) {
                    await prisma.lot.update({
                        where: { id: transaction.lot_id },
                        data: {
                            status: 'sold',
                            updated_at: new Date()
                        }
                    });
                }
            }
            // -------------------------------------

            // --- TRIGGER PAYMENT WEBHOOK ---
            // URL provided by user for Lot Info email:
            const paymentWebhookUrl = process.env.N8N_WEBHOOK_URL || "https://n8n-n8n.yszha2.easypanel.host/webhook/7b928d3b-2850-462d-87df-f6a87fe4108a";

            // Only trigger generic "New Purchase" webhook for Reservations (not Pie or Installments)
            if (paymentWebhookUrl && (!scope || scope === 'RESERVATION')) {
                // Fetch latest data to send complete info
                const updatedReservation = await prisma.reservation.findUnique({
                    where: { id: reservationId },
                    include: { lot: true }
                });

                const payload = {
                    contact_name: updatedReservation?.name,
                    contact_email: updatedReservation?.email,
                    contact_phone: updatedReservation?.phone,
                    contact_rut: updatedReservation?.rut,
                    contact_address: updatedReservation?.address,
                    lot_number: updatedReservation?.lot?.number,
                    lot_id: updatedReservation?.lot?.id,
                    lot_stage: updatedReservation?.lot?.stage,
                    lot_area_m2: updatedReservation?.lot?.area_m2,
                    lot_total_price: updatedReservation?.lot?.price_total_clp,
                    amount_paid: commitResponse.amount,
                    transbank_order_id: commitResponse.buy_order,
                    authorization_code: commitResponse.authorization_code,
                    payment_status: 'approved',
                    timestamp: new Date().toISOString(),
                    reservation_id: reservationId,
                    folio: updatedReservation?.folio,
                    token_ws: token,
                    webpay_status: commitResponse.status,
                    response_code: commitResponse.response_code,
                    payment_type_code: commitResponse.payment_type_code,
                    installments_number: commitResponse.installments_number,
                    // Additional helpful fields
                    scope,
                    user_id: userId
                };

                await fetch(paymentWebhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).then(res => {
                    if (!res.ok) console.error("Payment Webhook failed:", res.status, res.statusText);
                    else console.log("Payment Webhook sent successfully");
                }).catch(e => console.error("Failed to trigger payment webhook", e));
            }
            // -------------------------------------

            // --- TRIGGER SPECIFIC INSTALLMENT WEBHOOK ---
            if (scope === 'INSTALLMENT') {
                // Use shared library function
                await sendInstallmentWebhook(
                    reservationId,
                    commitResponse.amount,
                    transaction.installments_count || 1
                );
            }
            // -------------------------------------

            // --- TRIGGER SPECIFIC PIE WEBHOOK ---
            if (scope === 'PIE') {
                await sendPieWebhook(reservationId, commitResponse.amount);
            }
            // -------------------------------------


            // Redirect to Success Page
            if (scope === 'PIE' || scope === 'INSTALLMENT') {
                return NextResponse.redirect(
                    `${baseUrl}/pago-exito/payment?token=${token}&amount=${commitResponse.amount}&scope=${scope}`
                );
            }

            // Standard Reservation Success
            const successUrl = new URL(`${baseUrl}/pago-exito`);
            successUrl.searchParams.set('token', token);
            if (transaction.reservation_id) successUrl.searchParams.set('reservationId', transaction.reservation_id);
            if (transaction.lot_id) successUrl.searchParams.set('lotId', String(transaction.lot_id));

            return NextResponse.redirect(successUrl.toString());
        } else {
            const failureUrl = new URL(`${baseUrl}/pago-fallo`);
            failureUrl.searchParams.set('token', token);
            failureUrl.searchParams.set('code', String(commitResponse.response_code));
            if (transaction.lot_id) failureUrl.searchParams.set('lotId', String(transaction.lot_id));

            return NextResponse.redirect(failureUrl.toString());
        }

    } catch (error) {
        console.error('Commit Error:', error);
        return NextResponse.redirect(`${baseUrl}/pago-fallo?error=commit_error`);
    }
}
