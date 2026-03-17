import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Test connection
        await prisma.$connect();
        
        // Try a simple query
        const count = await prisma.lot.count();
        
        return NextResponse.json({ 
            ok: true, 
            message: 'Database connected successfully', 
            lotCount: count,
            env: {
                hasDbUrl: !!process.env.DATABASE_URL
            }
        });
    } catch (error: any) {
        console.error('Debug DB Error:', error);
        return NextResponse.json({ 
            ok: false, 
            error: error.message,
            stack: error.stack,
            env: {
                hasDbUrl: !!process.env.DATABASE_URL
            }
        }, { status: 500 });
    }
}
