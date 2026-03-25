import { NextResponse } from 'next/server';
import { verifyMobileToken } from '@/lib/mobile-auth';
import { getPaginatedReceipts, approvePaymentReceipt, rejectPaymentReceipt } from '@/actions/receipts';

export async function GET(req: Request) {
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

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
    const status = url.searchParams.get('status') || undefined;
    const search = url.searchParams.get('search') || undefined;

    const result = await getPaginatedReceipts({
        page,
        pageSize,
        status,
        search,
        serverAuthOverride: true
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Mobile Receipts GET Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
        }
    
        const token = authHeader.split(' ')[1];
        const payload = await verifyMobileToken(token);
    
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized. Solamente ADMINs pueden aprobar o rechazar recibos.' }, { status: 403 });
        }
    
        const { receiptId, action, reason } = await req.json();
    
        if (!receiptId || !action) {
            return NextResponse.json({ error: 'Faltan parámetros: receiptId o action (approve/reject)' }, { status: 400 });
        }
    
        if (action === 'approve') {
            await approvePaymentReceipt(receiptId, true);
            return NextResponse.json({ success: true, message: 'Pago aprobado' });
        } else if (action === 'reject') {
            if (!reason) {
                return NextResponse.json({ error: 'Debes indicar un motivo (reason) para rechazar' }, { status: 400 });
            }
            await rejectPaymentReceipt(receiptId, reason, true);
            return NextResponse.json({ success: true, message: 'Pago rechazado' });
        }
    
        return NextResponse.json({ error: 'Invalid action. Use approve or reject.' }, { status: 400 });
        } catch (error: any) {
        console.error('[Mobile Receipts PUT Error]', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
        }
}
