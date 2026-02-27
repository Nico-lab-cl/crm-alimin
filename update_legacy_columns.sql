-- Ejecutar CADA línea por separado si alguna falla con "column already exists"
-- -----------------------------------------------------------------
-- Columnas de ventas Offline / Legacy
-- -----------------------------------------------------------------
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "is_legacy" boolean NOT NULL DEFAULT false;
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "workflow_activated" boolean NOT NULL DEFAULT true;
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "legacy_current_installment" integer;
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "legacy_debt_start_date" timestamp(3);
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "legacy_uploaded_contracts" text;

-- -----------------------------------------------------------------
-- Columnas de datos legales (dirección / estado civil, etc.)
-- -----------------------------------------------------------------
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "marital_status" text;
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "profession" text;
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "nationality" text DEFAULT 'Chilena';
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "address_street" text;
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "address_number" text;
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "address_commune" text;
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "address_region" text;
