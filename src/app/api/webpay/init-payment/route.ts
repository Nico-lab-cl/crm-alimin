
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { webpayCreate } from '@/lib/transbank'; // Use shared utility
import { calculateTotalInterest, getInstallmentDueDate } from '@/lib/financials';

// Helper: Determine the exact price for a specific installment number
function getInstallmentAmount(
    installmentNumber: number,
    totalCuotas: number,
    baseValorCuota: number,
    lastInstallmentAmount: number,
    legacyRanges?: any
): number {
    if (installmentNumber === totalCuotas) {
        return lastInstallmentAmount;
    }
    if (legacyRanges && Array.isArray(legacyRanges)) {
        for (const range of legacyRanges) {
            if (installmentNumber >= range.from && installmentNumber <= range.to) {
                return range.amount;
            }
        }
    }
    return baseValorCuota;
}

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

            // Calculate Amount Iteratively using Custom Logic
            const startInstallment = currentPaid + 1;

            amount = 0;
            for (let i = 0; i < installments; i++) {
                const instNum = startInstallment + i;
                amount += getInstallmentAmount(
                    instNum,
                    totalCuotas,
                    valorCuota,
                    lastInstallmentAmount,
                    reservation.legacy_installment_ranges
                );
            }

            // Calculate Interest
            let totalInterest = 0;
            const customStart = reservation.legacy_installment_start_date ? new Date(reservation.legacy_installment_start_date) : null;
            const customDueDay = customStart ? customStart.getDate() : null;
            const acquisitionDate = customStart ? customStart.toISOString() : reservation.created_at.toISOString();

            // Iterate over each installment being paid
            for (let i = 0; i < installments; i++) {
                // User Request: Only apply interest to the FIRST installment in the batch (the oldest one).
                if (i > 0) continue;

                const installmentNum = startInstallment + i;
                const dueDate = getInstallmentDueDate(acquisitionDate, installmentNum, Boolean(reservation.is_legacy), customDueDay, Boolean(reservation.is_promo));

                // Determine amount for THIS specific installment taking ranges into account
                const instAmount = getInstallmentAmount(
                    installmentNum,
                    totalCuotas,
                    valorCuota,
                    lastInstallmentAmount,
                    reservation.legacy_installment_ranges
                );

                let daysLate = 0;

                // NEW SIMULATION LOGIC - RELIES ENTIRELY ON FINANCIALS UTILITY
                const effectiveNow = comparisonDate || simulatedDate || new Date();
                const now = new Date(effectiveNow);
                const chileNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Santiago" }));
                chileNow.setHours(0, 0, 0, 0);

                const totalPrice = reservation.lot.price_total_clp || 0;
                const lotAreaM2 = reservation.lot.area_m2 || 200;

                const interest = calculateTotalInterest(
                    totalPrice,
                    lotAreaM2,
                    dueDate,
                    Boolean(reservation.is_legacy),
                    chileNow,
                    // @ts-ignore - Prisma client cache issue
                    Boolean(reservation.mora_frozen),
                    reservation.legacy_debt_start_date,
                    // @ts-ignore
                    reservation.legacy_debt_end_date
                );

                if (interest > 0) {
                    totalInterest += interest;
                    console.log(`Installment ${installmentNum}: Applied Interest: ${interest}`);
                }
            }

            const additionalDebt = (reservation as any).pending_amount || 0;
            const discount = (reservation as any).next_installment_discount || 0;
            amount = Math.max(0, amount + totalInterest + additionalDebt - discount);
            console.log(`Total Amount: ${amount} (Includes Interest: ${totalInterest}, Additional Debt: ${additionalDebt}, Discount: ${discount})`);

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
