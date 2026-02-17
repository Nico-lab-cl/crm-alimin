
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { webpayCommit } from '@/lib/transbank';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get('token_ws'); // Success
    const tbkToken = searchParams.get('TBK_TOKEN'); // Aborted
    const scope = searchParams.get('scope') || 'RESERVATION'; // Default to RESERVATION if missing (e.g. old flow)

    // Handle aborted payment
    if (tbkToken && !token) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pago-fallo?token=${tbkToken}`);
    }

    if (!token) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pago-fallo?error=missing_token`);
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
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pago-fallo?error=transaction_not_found`);
        }

        // 3. Update Transaction Record
        const status = commitResponse.status === 'AUTHORIZED' && commitResponse.response_code === 0 ? 'AUTHORIZED' : 'FAILED';

        await prisma.webpayTransaction.update({
            where: { token },
            data: {
                status: status,
                response_code: commitResponse.response_code,
                authorization_code: commitResponse.authorization_code,
                payment_type_code: commitResponse.payment_type_code,
                installments_number: commitResponse.installments_number,
                transaction_date: new Date(commitResponse.transaction_date),
                processed_at: new Date()
            }
        });

        if (status === 'AUTHORIZED') {
            // Update Reservation/Lot based on Scope
            const reservationId = transaction.reservation_id;

            if (scope === 'PIE') {
                await prisma.reservation.update({
                    where: { id: reservationId },
                    data: {
                        pie_status: 'PAID',
                        // Logic: if Pie is paid, maybe move pipeline stage?
                        pipeline_stage: 'PIE_PAGADO'
                    }
                });
            } else if (scope === 'INSTALLMENT') {
                // Increment installments paid
                await prisma.reservation.update({
                    where: { id: reservationId },
                    data: {
                        installments_paid: {
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
                        pipeline_stage: 'RESERVA_PAGADA'
                    }
                });
            }

            // Redirect to Success Page
            // If it's PIE or INSTALLMENT, redirect to specific payment success page
            if (scope === 'PIE' || scope === 'INSTALLMENT') {
                return NextResponse.redirect(
                    `${process.env.NEXT_PUBLIC_APP_URL}/pago-exito/payment?token=${token}&amount=${commitResponse.amount}&scope=${scope}`
                );
            }

            // Standard Reservation Success
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pago-exito?token=${token}`);
        } else {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pago-fallo?token=${token}&code=${commitResponse.response_code}`);
        }

    } catch (error) {
        console.error('Commit Error:', error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pago-fallo?error=commit_error`);
    }
}
