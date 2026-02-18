
import { NextRequest, NextResponse } from 'next/server';
import { sendPieWebhook, sendInstallmentWebhook } from '@/lib/webhooks';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const reservationId = searchParams.get('id');
    const type = searchParams.get('type'); // PIE or INSTALLMENT
    const amount = Number(searchParams.get('amount')) || 10000; // Simulated amount

    if (!reservationId || !type) {
        return NextResponse.json({
            error: 'Missing id or type',
            usage: '/api/test-webhook?id=RESERVATION_UUID&type=PIE&amount=500000'
        }, { status: 400 });
    }

    let result;
    if (type === 'PIE') {
        result = await sendPieWebhook(reservationId, amount);
    } else if (type === 'INSTALLMENT') {
        result = await sendInstallmentWebhook(reservationId, amount, 1);
    } else {
        return NextResponse.json({ error: 'Invalid type. Use PIE or INSTALLMENT' }, { status: 400 });
    }

    return NextResponse.json(result);
}
