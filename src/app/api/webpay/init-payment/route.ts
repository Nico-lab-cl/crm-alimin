
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { webpayCreate } from '@/lib/transbank'; // Use shared utility

export async function POST(request: Request) {
    console.log("Processing init-payment request...");
    try {
        const body = await request.json();
        const { reservationId, scope, installments, simulatedDate, comparisonDate } = body; // scope: 'PIE' | 'INSTALLMENT'

        if (!reservationId || !scope) {
            return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
        }

        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { lot: true }
        });

        if (!reservation || !reservation.lot) {
            return NextResponse.json({ error: 'Reserva o lote no encontrado' }, { status: 404 });
        }

        let amount = 0;
        let buyOrderScope = '';
        let installmentsCount = 0;

        if (scope === 'PIE') {
            const pieTotal = reservation.lot.pie || 0;
            const reservationPaid = reservation.lot.reservation_amount_clp || 0;
            // The user wants to subtract reservation amount from Pie
            amount = Math.max(0, pieTotal - reservationPaid);
            buyOrderScope = 'PIE';
            installmentsCount = 0;

            if (amount <= 0) {
                return NextResponse.json({ error: 'El monto del pie es 0 o menor' }, { status: 400 });
            }
        } else if (scope === 'INSTALLMENT') {
            if (!installments || installments <= 0) {
                return NextResponse.json({ error: 'Cantidad de cuotas inválida' }, { status: 400 });
            }

            const currentPaid = reservation.installments_paid || 0;
            const totalCuotas = reservation.lot.cuotas || 0;
            const valorCuota = reservation.lot.valor_cuota || 0;
            // @ts-ignore
            const lastInstallmentAmount = reservation.lot.last_installment_amount || valorCuota;

            if (currentPaid + installments > totalCuotas) {
                return NextResponse.json({ error: 'La cantidad de cuotas excede el total restante' }, { status: 400 });
            }

            // Calculate Amount with Custom Last Installment Logic
            const startInstallment = currentPaid + 1;
            const endInstallment = startInstallment + installments - 1;
            const includesLastInstallment = endInstallment === totalCuotas;

            if (includesLastInstallment) {
                // Determine base amount
                const baseAmount = ((installments - 1) * valorCuota) + lastInstallmentAmount;
                amount = baseAmount;
            } else {
                amount = installments * valorCuota;
            }

            // Calculate Interest
            let totalInterest = 0;
            const acquisitionDate = reservation.created_at;

            // Iterate over each installment being paid
            for (let i = 0; i < installments; i++) {
                // User Request: Only apply interest to the FIRST installment in the batch (the oldest one).
                if (i > 0) continue;

                const installmentNum = startInstallment + i;
                const dueDate = new Date(acquisitionDate);
                dueDate.setMonth(dueDate.getMonth() + installmentNum);
                dueDate.setDate(5);
                dueDate.setHours(0, 0, 0, 0);

                // Determine amount for THIS specific installment
                let instAmount = valorCuota;
                if (installmentNum === totalCuotas) {
                    instAmount = lastInstallmentAmount;
                }

                let daysLate = 0;

                // SMART SIMULATION LOGIC
                // effectiveNow is the Simulated Payment Date
                const effectiveNow = comparisonDate || simulatedDate || new Date();
                const now = new Date(effectiveNow);
                const chileNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Santiago" }));
                // Reset hours for fair comparison
                chileNow.setHours(0, 0, 0, 0);

                // Grace Period End (10th of the due month)
                const gracePeriodEnd = new Date(dueDate);
                gracePeriodEnd.setDate(10);
                // Grace period lasts until end of that day
                gracePeriodEnd.setHours(23, 59, 59, 999);

                // Calculate Delay
                if (chileNow > gracePeriodEnd) {
                    const diffTime = chileNow.getTime() - gracePeriodEnd.getTime();
                    daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                }

                if (daysLate > 0) {
                    let factor = 0.027785496; // Default / Low tier (>= 64)
                    if (totalCuotas >= 77) {
                        factor = 0.0227324392; // High tier
                    }
                    const dailyInterest = Math.round(instAmount * factor);
                    const interest = dailyInterest * daysLate;

                    totalInterest += interest;
                    console.log(`Installment ${installmentNum}: Late by ${daysLate} days. Interest: ${interest}`);
                }
            }

            amount += totalInterest;
            console.log(`Total Amount: ${amount} (Includes Interest: ${totalInterest})`);

            buyOrderScope = 'CUOTA';
            installmentsCount = installments;

            if (amount <= 0) {
                return NextResponse.json({ error: 'El monto de la cuota es 0' }, { status: 400 });
            }
        } else {
            return NextResponse.json({ error: 'Scope inválido' }, { status: 400 });
        }

        const buyOrder = `${buyOrderScope}-${Date.now()}`;
        const sessionId = reservationId;
        // Correct return URL for success page handling
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aliminlomasdelmar.com';
        const returnUrl = `${baseUrl}/api/webpay/commit?scope=${scope}`;

        const createResponse = await webpayCreate({
            buyOrder,
            sessionId,
            amount,
            returnUrl
        });

        // @ts-ignore
        const token = createResponse.token;
        // @ts-ignore
        const url = createResponse.url;

        // Store transaction intent
        await prisma.webpayTransaction.create({
            data: {
                token: token,
                buy_order: buyOrder,
                amount_clp: amount,
                status: 'INITIALIZED',
                reservation_id: reservationId,
                lot_id: reservation.lot.id,
                scope: scope,
                installments_count: installmentsCount
            }
        });

        const result = {
            token: token,
            url: url,
            amount: amount
        };
        console.log("Webpay initialized successfully:", result);
        return NextResponse.json(result);

    } catch (error) {
        console.error('Webpay init error:', error);
        return NextResponse.json({ error: 'Error al iniciar pago' }, { status: 500 });
    }
}
