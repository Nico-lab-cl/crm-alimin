import { NextResponse } from 'next/server';
import { verifyMobileToken } from '@/lib/mobile-auth';
import { getFullPostventaData } from '@/actions/postventa';

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

    // Determine Stage filter from URL if needed, default to 'ALL'
    const url = new URL(req.url);
    const stage = url.searchParams.get('stage') || 'ALL';

    const result = await getFullPostventaData({ 
        stage, 
        serverAuthOverride: true 
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Mobile Ledger Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
