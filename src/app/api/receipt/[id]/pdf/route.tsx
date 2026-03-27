import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { PaymentReceiptPDF } from "@/components/pdf/PaymentReceiptPDF";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getInstallmentDueDate } from "@/lib/financials";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        // Allow admin, seller, or the buyer themselves to view the receipt
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const receipt = await prisma.paymentReceipt.findUnique({
            where: { id },
            include: {
                reservation: {
                    include: { lot: true }
                },
                lot: true
            }
        });

        if (!receipt) {
            return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
        }

        // Security check: Only buyer or admin/seller can view
        if (session.user.role === 'USER' && receipt.reservation.buyer_id !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const logoPath = 'public/favicon.png';

        let installmentDueDate: Date | undefined;
        if (receipt.scope === 'INSTALLMENT' && receipt.installments_count) {
            const baseDate = receipt.reservation.legacy_installment_start_date 
                ? new Date(receipt.reservation.legacy_installment_start_date)
                : new Date(receipt.reservation.created_at);
            
            const customStart = receipt.reservation.legacy_installment_start_date ? new Date(receipt.reservation.legacy_installment_start_date) : null;
            const customDueDay = customStart ? customStart.getUTCDate() : null; // Using UTC date to avoid timezone shift

            installmentDueDate = getInstallmentDueDate(
                baseDate,
                receipt.installments_count,
                 Boolean(receipt.reservation.is_legacy),
                customDueDay,
                Boolean(receipt.reservation.is_promo)
            );
        }

        const stream = await renderToStream(
            <PaymentReceiptPDF
                receiptId={receipt.id}
                receiptDate={receipt.processed_at || receipt.created_at}
                clientName={receipt.reservation.name}
                clientRut={receipt.reservation.rut || ""}
                clientEmail={receipt.reservation.email}
                lotNumber={receipt.lot.number || ""}
                lotStage={receipt.lot.stage || 0}
                amountPaid={receipt.amount_clp}
                paymentScope={receipt.scope}
                installmentsCount={receipt.installments_count || 0}
                totalInstallments={receipt.lot.cuotas || 0}
                nominalInstallmentNumber={receipt.nominal_installment_number}
                nominalInstallmentRange={receipt.nominal_installment_range}
                installmentDueDate={installmentDueDate}
                logoPath={logoPath}
            />
        );

        return new NextResponse(stream as unknown as ReadableStream, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="Recibo_Pago_Lote_${receipt.lot.number}.pdf"`,
            },
        });

    } catch (error) {
        console.error("Error generating receipt PDF:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
