import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Determine user ID. If session has ID, use it. If not, lookup by email.
        let userId = session.user.id;

        if (!userId) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email }
            });
            if (user) {
                userId = user.id;
            }
        }

        if (!userId) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const reservations = await prisma.reservation.findMany({
            where: { buyer_id: userId },
            include: { lot: true, receipts: true },
            orderBy: { created_at: "desc" },
        });

        // Strip massive base64 strings to optimize payload size
        const optimizedReservations = reservations.map(res => {
            let uploadedContractUrl = res.uploaded_contract_url ? 
                `/api/contracts/${res.id}/file?type=RESERVA&name=Contrato_Reserva.pdf` : null;

            let legacyContractsMeta = null;
            if (res.legacy_uploaded_contracts) {
                try {
                    const parsedLegacy = typeof res.legacy_uploaded_contracts === 'string' 
                        ? JSON.parse(res.legacy_uploaded_contracts) 
                        : res.legacy_uploaded_contracts;
                    if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
                        legacyContractsMeta = JSON.stringify([{
                            name: parsedLegacy[0].name || 'Promesa de Compraventa',
                            url: `/api/contracts/${res.id}/file?type=PROMESA&name=${encodeURIComponent(parsedLegacy[0].name || 'Promesa_Compraventa.pdf')}`
                        }]);
                    }
                } catch (e) {}
            }

            let manualDocumentsMeta: any = [];
            if ((res as any).manual_documents) {
                try {
                    const parsedManual = Array.isArray((res as any).manual_documents) 
                        ? (res as any).manual_documents 
                        : JSON.parse((res as any).manual_documents as string);
                    
                    manualDocumentsMeta = parsedManual.map((d: any) => ({
                        name: d.name,
                        category: d.category,
                        uploadedAt: d.uploadedAt,
                        url: `/api/contracts/${res.id}/file?type=${encodeURIComponent(d.category)}&name=${encodeURIComponent(d.name)}`
                    }));
                } catch (e) {}
            }

            return {
                ...res,
                uploaded_contract_url: uploadedContractUrl,
                legacy_uploaded_contracts: legacyContractsMeta,
                manual_documents: manualDocumentsMeta
            };
        });

        return NextResponse.json(optimizedReservations);
    } catch (error) {
        console.error("Error fetching user reservations:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
