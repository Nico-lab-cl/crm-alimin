-- Script de Optimización de Base de Datos para Lomas del Mar
-- Copia y pega esto en tu administrador de base de datos (pgAdmin, DBeaver, etc.)

-- Índices para Reservas (Optimiza el Dashboard y Postventa)
CREATE INDEX IF NOT EXISTS idx_reservation_lot_id ON "Reservation" (lot_id);
CREATE INDEX IF NOT EXISTS idx_reservation_buyer_id ON "Reservation" (buyer_id);
CREATE INDEX IF NOT EXISTS idx_reservation_status ON "Reservation" (status);
CREATE INDEX IF NOT EXISTS idx_reservation_pipeline_stage ON "Reservation" (pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_reservation_pie_status ON "Reservation" (pie_status);

-- Índices para Lotes (Optimiza la carga de la lista de terrenos)
CREATE INDEX IF NOT EXISTS idx_lot_status ON "Lot" (status);

-- Índices para Comprobantes de Pago (Optimiza la sección de Pagos)
CREATE INDEX IF NOT EXISTS idx_receipt_reservation_id ON "PaymentReceipt" (reservation_id);
CREATE INDEX IF NOT EXISTS idx_receipt_status ON "PaymentReceipt" (status);
CREATE INDEX IF NOT EXISTS idx_receipt_created_at ON "PaymentReceipt" (created_at DESC);
