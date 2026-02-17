
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { webpayCommit } from '@/lib/transbank';
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
                            role: Role.USER
                        }
                    });

                    // Trigger Registration Webhook (New User)
                    // URL from register/route.ts
                    const registerWebhookUrl = "https://n8n-n8n.yszha2.easypanel.host/webhook/6014ee07-0470-4a07-aa94-2e5266bd9a03";

                    try {
                        // Generate Verification Token
                        const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "fallback_secret");
                        const verifToken = await new SignJWT({ email: user.email, sub: user.id, type: 'email-verification' })
                            .setProtectedHeader({ alg: "HS256" })
                            .setIssuedAt()
                            .setExpirationTime("24h")
                            .sign(secret);

                        const protocol = req.headers.get("x-forwarded-proto") || "http";
                        const host = req.headers.get("host");
                        // Use NEXTAUTH_URL or derive from request, but usually env is safer for webhooks
                        const appUrl = process.env.NEXTAUTH_URL || `${protocol}://${host}`;
                        const verificationLink = `${appUrl}/verify-email?token=${verifToken}`;

                        // Fire and forget
                        fetch(registerWebhookUrl, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                email: user.email,
                                name: user.name,
                                verificationLink,
                                password: randomPassword, // Optional: send temporary password? Maybe security risk, but creating explicit account via payment usually implies sending creds.
                                // If not sending password, user uses Forgot Password.
                                source: 'payment_auto_register',
                                timestamp: new Date().toISOString(),
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
            const paymentWebhookUrl = process.env.N8N_WEBHOOK_URL;
            if (paymentWebhookUrl) {
                // Fetch latest data to send complete info
                const updatedReservation = await prisma.reservation.findUnique({
                    where: { id: reservationId },
                    include: { lot: true }
                });

                const payload = {
                    event: 'payment_success',
                    scope,
                    transaction: {
                        token,
                        amount: commitResponse.amount,
                        authorization_code: commitResponse.authorization_code,
                        date: commitResponse.transaction_date
                    },
                    reservation: updatedReservation,
                    user_id: userId,
                    timestamp: new Date().toISOString()
                };

                fetch(paymentWebhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).catch(e => console.error("Failed to trigger payment webhook", e));
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
