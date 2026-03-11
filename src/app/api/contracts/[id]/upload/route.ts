import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        // Only ADMIN or SELLER can upload contracts
        if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "SELLER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { fileData, type, fileName } = await request.json();

        if (!fileData) {
            return NextResponse.json({ error: "No file data provided" }, { status: 400 });
        }

        // Validate base64 prefix
        if (!fileData.startsWith("data:application/pdf;base64,")) {
            return NextResponse.json({ error: "Invalid file format. Must be a base64 PDF." }, { status: 400 });
        }

        const reservation = await prisma.reservation.findUnique({ where: { id } });
        if (!reservation) {
            return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
        }

        if (type === "legacy") {
            // Handle multiple offline contracts
            let existingContracts: { name: string, url: string }[] = [];
            if (reservation.legacy_uploaded_contracts) {
                try {
                    existingContracts = JSON.parse(reservation.legacy_uploaded_contracts);
                } catch (e) {
                    // ignore parse error, start fresh
                }
            }

            existingContracts.push({
                name: fileName || `Documento_Offline_${existingContracts.length + 1}.pdf`,
                url: fileData
            });

            const updatedReservation = await prisma.reservation.update({
                where: { id },
                data: { legacy_uploaded_contracts: JSON.stringify(existingContracts) },
            });

            return NextResponse.json({ success: true, reservation: updatedReservation });
        } else if (type && type !== "promesa" && type !== "reserva") {
            // MANUAL CATEGORIZED DOCUMENTS (Gastos Operacionales, Comprobante Pie, etc)
            let existingDocs: any[] = [];
            if (reservation.manual_documents) {
                try {
                    existingDocs = Array.isArray(reservation.manual_documents) 
                        ? reservation.manual_documents 
                        : JSON.parse(reservation.manual_documents as string);
                } catch (e) {
                    // ignore parse error
                }
            }

            existingDocs.push({
                name: fileName || `${type.replace(/_/g, ' ')}.pdf`,
                url: fileData,
                category: type,
                uploadedAt: new Date().toISOString()
            });

            const updatedReservation = await prisma.reservation.update({
                where: { id },
                data: { manual_documents: existingDocs },
            });

            return NextResponse.json({ success: true, reservation: updatedReservation });
        } else {
            // Traditional Promesa Flow
            const updatedReservation = await prisma.reservation.update({
                where: { id },
                data: {
                    uploaded_contract_url: fileData,
                },
            });
            return NextResponse.json({ success: true, reservation: updatedReservation });
        }

    } catch (error) {
        console.error("Error uploading contract:", error);
        return NextResponse.json({ error: "Failed to upload contract" }, { status: 500 });
    }
}
