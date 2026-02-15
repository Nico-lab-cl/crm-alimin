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

        const reservation = await prisma.reservation.findUnique({
            where: { id },
            include: { lot: true },
        });

        if (!reservation) {
            return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
        }

        // Authorization check
        // 1. If user is logged in: Must be Admin or the Buyer or have matching email.
        // 2. If user is NOT logged in (public access via link): Allow if reservation exists (UUID is the secret).
        // This matches the logic of /api/receipt/[id] which is used on the public /pago-exito page.

        let isAuthorized = false;

        if (session && session.user) {
            const isAdmin = session.user.role === 'ADMIN';
            const isBuyer = reservation.buyer_id === session.user.id;
            const isEmailMatch = reservation.email === session.user.email;
            if (isAdmin || isBuyer || isEmailMatch) {
                isAuthorized = true;
            }
        } else {
            // Public access via UUID (for pago-exito page where user might not be logged in yet)
            // We assume possession of the UUID link is sufficient proof for viewing the contract,
            // similar to how the receipt details are shown.
            isAuthorized = true;
        }

        if (!isAuthorized) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (!reservation.lot) {
            return NextResponse.json({ error: 'Lot data missing' }, { status: 500 });
        }

        const logoPath = path.join(process.cwd(), 'public', 'logo.png');
        const signaturePath = path.join(process.cwd(), 'public', 'firma_patricio_escobar.png');

        // Read signature file and convert to base64 to ensure it renders
        // react-pdf sometimes has issues with local file paths in production/container environments
        const fs = require('fs');
        let signatureBase64 = null;
        try {
            if (fs.existsSync(signaturePath)) {
                const signatureBuffer = fs.readFileSync(signaturePath);
                signatureBase64 = `data:image/png;base64,${signatureBuffer.toString('base64')}`;
            }
        } catch (err) {
            console.error('Error reading signature file:', err);
        }

        const stream = await renderToStream(
            <ReservationContract
                reservation={reservation}
                lot={reservation.lot}
                logoPath={logoPath}
                signaturePath={signatureBase64 || signaturePath} // Fallback to path if base64 fails
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
