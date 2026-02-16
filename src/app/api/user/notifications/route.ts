import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

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
            where: {
                OR: [
                    { buyer_id: user.id },
                    { seller_id: user.id },
                ],
            },
            include: {
                lot: {
                    select: {
                        number: true,
                        stage: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        const notifications: Array<{
            id: string;
            type: 'contract_pending' | 'lot_purchased';
            message: string;
            lotNumber?: string;
            stage?: string;
        }> = [];


        reservations.forEach((reservation: any) => {
            // Check for pending contract signatures
            // If payment is complete (status='paid') but contract not signed yet (signed_at is null)
            if (reservation.status === 'paid' && !reservation.signed_at) {
                notifications.push({
                    id: `contract-${reservation.id}`,
                    type: 'contract_pending',
                    message: 'Tienes un contrato pendiente de firma. Ingresa a tu panel para firmarlo digitalmente.',
                    lotNumber: reservation.lot.number || '',
                    stage: String(reservation.lot.stage || ''),
                });
            }

            // Check for recently purchased lots (within last 7 days)
            const purchaseDate = new Date(reservation.created_at);
            const daysSincePurchase = Math.floor((Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));

            // Show notification for any paid reservation in the last 7 days
            if (daysSincePurchase <= 7 && reservation.status === 'paid') {
                notifications.push({
                    id: `purchase-${reservation.id}`,
                    type: 'lot_purchased',
                    message: 'Tu compra se ha completado exitosamente. Revisa los detalles en tu panel.',
                    lotNumber: reservation.lot.number || '',
                    stage: String(reservation.lot.stage || ''),
                });
            }
        });

        return NextResponse.json({
            ok: true,
            notifications,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
