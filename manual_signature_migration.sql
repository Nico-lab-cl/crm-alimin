-- Add digital signature columns to the Reservation table
ALTER TABLE "Reservation" ADD COLUMN "signature_otp" TEXT;
ALTER TABLE "Reservation" ADD COLUMN "signature_otp_expires" TIMESTAMP(3);
ALTER TABLE "Reservation" ADD COLUMN "signed_at" TIMESTAMP(3);
ALTER TABLE "Reservation" ADD COLUMN "signature_ip" TEXT;
