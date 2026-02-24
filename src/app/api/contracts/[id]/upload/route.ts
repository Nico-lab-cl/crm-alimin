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
        const { fileData } = await request.json();

        if (!fileData) {
            return NextResponse.json({ error: "No file data provided" }, { status: 400 });
        }

        // Validate base64 prefix
        if (!fileData.startsWith("data:application/pdf;base64,")) {
            return NextResponse.json({ error: "Invalid file format. Must be a base64 PDF." }, { status: 400 });
        }

        // Update the reservation record with the uploaded contract base64 string
        const updatedReservation = await prisma.reservation.update({
            where: { id },
            data: {
                uploaded_contract_url: fileData,
            },
        });

        return NextResponse.json({ success: true, reservation: updatedReservation });

    } catch (error) {
        console.error("Error uploading contract:", error);
        return NextResponse.json({ error: "Failed to upload contract" }, { status: 500 });
    }
}
