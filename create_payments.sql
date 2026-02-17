-- Add payment scope to WebpayTransaction to distinguish between Reservation, Pie, and Installments
-- Valid values: 'RESERVATION', 'PIE', 'INSTALLMENT'
ALTER TABLE "WebpayTransaction" ADD COLUMN "scope" TEXT DEFAULT 'RESERVATION';

-- Add additional metadata to WebpayTransaction to store how many installments are being paid (if scope is INSTALLMENT)
ALTER TABLE "WebpayTransaction" ADD COLUMN "installments_count" INTEGER DEFAULT 0;

-- Add tracking fields to Reservation
-- pie_status: 'PENDING', 'PAID'
ALTER TABLE "Reservation" ADD COLUMN "pie_status" TEXT DEFAULT 'PENDING';

-- installments_paid: Counter for how many monthly installments have been paid
ALTER TABLE "Reservation" ADD COLUMN "installments_paid" INTEGER DEFAULT 0;
