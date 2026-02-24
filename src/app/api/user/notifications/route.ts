import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Fetch reservations for this user
        const reservations = await prisma.reservation.findMany({
            where: { buyer_id: user.id },
            include: {
                lot: { select: { number: true, stage: true } },
            },
            orderBy: { created_at: 'desc' },
        });

        const dynamicNotifications: Array<{
            id: string;
            type: string;
            title: string;
            message: string;
            lotNumber?: string;
            stage?: string;
            read?: boolean;
            db?: boolean;
        }> = [];

        reservations.forEach((reservation: any) => {
            // Check for pending contract signatures
            if (reservation.status === 'paid' && !reservation.signed_at) {
                dynamicNotifications.push({
                    id: `contract-${reservation.id}`,
                    type: 'contract_pending',
                    title: '📝 Contrato pendiente de firma',
                    message: 'Tienes un contrato pendiente de firma. Ingresa a tu panel para firmarlo digitalmente.',
                    lotNumber: reservation.lot.number || '',
                    stage: String(reservation.lot.stage || ''),
                    read: false,
                    db: false,
                });
            }

            // Recently purchased (last 7 days)
            const purchaseDate = new Date(reservation.created_at);
            const daysSincePurchase = Math.floor((Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysSincePurchase <= 7 && reservation.status === 'paid') {
                dynamicNotifications.push({
                    id: `purchase-${reservation.id}`,
                    type: 'lot_purchased',
                    title: '🎉 ¡Felicitaciones por tu compra!',
                    message: 'Tu compra se ha completado exitosamente. Revisa los detalles en tu panel.',
                    lotNumber: reservation.lot.number || '',
                    stage: String(reservation.lot.stage || ''),
                    read: false,
                    db: false,
                });
            }

            // Signed but compraventa not yet uploaded (lawyers working on it)
            if (reservation.signed_at && !reservation.uploaded_contract_url) {
                dynamicNotifications.push({
                    id: `compraventa-pending-${reservation.id}`,
                    type: 'contract_pending',
                    title: '⚖️ Promesa de compraventa en proceso',
                    message: 'Nuestros abogados están trabajando en tu contrato de promesa de compra y venta. En un plazo de 48 horas lo verás en la sección de Documentos.',
                    lotNumber: reservation.lot.number || '',
                    stage: String(reservation.lot.stage || ''),
                    read: false,
                    db: false,
                });
            }
        });

        // Fetch DB notifications (unread only)
        const dbNotifications = await prisma.notification.findMany({
            where: { user_id: user.id, read: false },
            orderBy: { created_at: 'desc' },
        });

        const dbFormatted = dbNotifications.map((n: any) => ({
            id: n.id,
            type: n.type,
            title: n.title,
            message: n.message,
            read: n.read,
            db: true, // Flag so client knows to call DELETE to mark as read
        }));

        return NextResponse.json({
            ok: true,
            notifications: [...dbFormatted, ...dynamicNotifications],
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Mark DB notification as read
export async function DELETE(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

        // Make sure the notification belongs to this user
        const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        await prisma.notification.updateMany({
            where: { id, user_id: user.id },
            data: { read: true },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Error marking notification read:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
