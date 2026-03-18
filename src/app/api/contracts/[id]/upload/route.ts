import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { memoryCache } from "@/lib/cache";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const isPostventa = session?.user?.email === 'postventa@lomasdelmar.cl';

        // Only ADMIN, SELLER or POSTVENTA can upload contracts
        if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "SELLER" && !isPostventa)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { fileData, type, fileName } = await request.json();

        if (!fileData) {
            return NextResponse.json({ error: "No file data provided" }, { status: 400 });
        }

        // Validate base64 prefix for multiple formats
        const allowedPrefixes = [
            "data:application/pdf;base64,",
            "data:image/jpeg;base64,",
            "data:image/png;base64,",
            "data:application/msword;base64,",
            "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
            "data:application/vnd.ms-excel;base64,",
            "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,"
        ];

        if (!allowedPrefixes.some(prefix => fileData.startsWith(prefix))) {
            return NextResponse.json({ error: "Invalid file format. Must be PDF, Image, Word or Excel." }, { status: 400 });
        }

        const reservation = await prisma.reservation.findUnique({ where: { id } });
        if (!reservation) {
            return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
        }

        if (type === "legacy") {
            // Handle multiple manual/offline documents
            let existingDocs: { name: string, url: string }[] = [];
            if (reservation.legacy_uploaded_contracts) {
                try {
                    existingDocs = JSON.parse(reservation.legacy_uploaded_contracts);
                } catch (e) {
                    // ignore parse error, start fresh
                }
            }

            existingDocs.push({
                name: fileName || `Documento_Offline_${existingDocs.length + 1}.pdf`,
                url: fileData,
            });

            const updatedReservation = await prisma.reservation.update({
                where: { id },
                data: { legacy_uploaded_contracts: JSON.stringify(existingDocs) },
            });

            // Invalidate postventa cache after upload
            memoryCache.deleteByPrefix('postventa_full_');

            return NextResponse.json({ success: true, reservation: updatedReservation });
        } else if (type?.toUpperCase() === "RESERVA" || type?.toUpperCase() === "PROMESA" || !type) {
            // Reserva/Promesa main field
            const updatedReservation = await prisma.reservation.update({
                where: { id },
                data: {
                    uploaded_contract_url: fileData,
                },
            });

            // Invalidate postventa cache after upload
            memoryCache.deleteByPrefix('postventa_full_');

            return NextResponse.json({ success: true, reservation: updatedReservation });
        } else {
            // manual_documents logic
            let existingDocs: any[] = [];
            if (reservation.manual_documents) {
                try {
                    existingDocs = Array.isArray(reservation.manual_documents) 
                        ? (reservation.manual_documents as any[]) 
                        : JSON.parse(reservation.manual_documents as string);
                } catch (e) {}
            }

            existingDocs.push({
                name: fileName || `${type.replace(/_/g, ' ')}.pdf`,
                url: fileData,
                category: type,
                uploadedAt: new Date().toISOString()
            });

            // @ts-ignore
            const updatedReservation = await prisma.reservation.update({
                where: { id },
                data: { manual_documents: existingDocs },
            });

            // Invalidate postventa cache after upload
            memoryCache.deleteByPrefix('postventa_full_');

            return NextResponse.json({ success: true, reservation: updatedReservation });
        }

    } catch (error) {
        console.error("Error uploading contract:", error);
        return NextResponse.json({ error: "Failed to upload contract" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const isPostventa = session?.user?.email === 'postventa@lomasdelmar.cl';

        if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "SELLER" && !isPostventa)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { type, url, name } = await request.json();

        const reservation = await prisma.reservation.findUnique({ where: { id } });
        if (!reservation) {
            return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
        }

        let updateData: any = {};

        if (!type || type?.toUpperCase() === "PROMESA" || type?.toUpperCase() === "RESERVA") {
            updateData.uploaded_contract_url = null;
        } else if (type === "legacy") {
            let docs: any[] = [];
            if (reservation.legacy_uploaded_contracts) {
                try {
                    docs = JSON.parse(reservation.legacy_uploaded_contracts);
                } catch (e) {}
            }
            updateData.legacy_uploaded_contracts = JSON.stringify(docs.filter(d => d.url !== url));
        } else {
            // manual_documents - match by name+category since URLs have been replaced with API URLs
            let docs: any[] = [];
            if (reservation.manual_documents) {
                try {
                    docs = Array.isArray(reservation.manual_documents) 
                        ? (reservation.manual_documents as any[]) 
                        : JSON.parse(reservation.manual_documents as string);
                } catch (e) {}
            }
            // Match by name AND category for precise deletion
            if (name) {
                updateData.manual_documents = docs.filter(d => !(d.category === type && d.name === name));
            } else {
                // Fallback: filter by category (removes all docs of that category)
                updateData.manual_documents = docs.filter(d => d.category !== type);
            }
        }

        await prisma.reservation.update({
            where: { id },
            data: updateData,
        });

        // Invalidate postventa cache so data is fresh on reload
        memoryCache.deleteByPrefix('postventa_full_');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting contract:", error);
        return NextResponse.json({ error: "Failed to delete contract" }, { status: 500 });
    }
}
