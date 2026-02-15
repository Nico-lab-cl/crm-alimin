import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { ReservationContract } from '@/components/pdf/ReservationContract';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const reservation = await prisma.reservation.findUnique({
            where: { id },
            include: { lot: true },
        });

        if (!reservation) {
            return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
        }

        // Authorization check: Admin or the buyer
        const isAdmin = session.user.role === 'ADMIN';
        const isBuyer = reservation.buyer_id === session.user.id;
        // Also consider if the user's email matches the reservation email (for cases where buyer_id might not be linked yet but they are logged in)
        const isEmailMatch = reservation.email === session.user.email;

        if (!isAdmin && !isBuyer && !isEmailMatch) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (!reservation.lot) {
            return NextResponse.json({ error: 'Lot data missing' }, { status: 500 });
        }

        const logoPath = path.join(process.cwd(), 'public', 'logo.png');

        const stream = await renderToStream(
            <ReservationContract
                reservation={reservation}
                lot={reservation.lot}
                logoPath={logoPath}
            />
        );

        return new NextResponse(stream as unknown as BodyInit, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Contrato_Reserva_${reservation.folio || id}.pdf"`,
            },
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
