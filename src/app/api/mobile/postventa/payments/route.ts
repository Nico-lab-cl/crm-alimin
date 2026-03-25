import { NextResponse } from 'next/server';
import { verifyMobileToken } from '@/lib/mobile-auth';
import { registerPostventaPayment } from '@/actions/postventa';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyMobileToken(token);

    if (!payload || (payload.role !== 'ADMIN' && payload.email !== 'postventa@aliminspa.cl' && payload.email !== 'postventa@lomasdelmar.cl')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { reservationId, amount, scope, receiptUrl, date } = body;

    if (!reservationId || !amount || !scope) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos: reservationId, amount o scope' }, { status: 400 });
    }

    const result = await registerPostventaPayment({
        reservationId,
        amount: Number(amount),
        scope,
        receiptUrl,
        date,
        serverAuthOverride: true
    });

    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Mobile Payments POST Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
