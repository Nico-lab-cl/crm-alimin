-- =============================================================
-- FIX: Cliente pagó $550,000 pero el sistema registró $540,000
-- porque tenía un descuento compensatorio de $10,000 activo.
-- 
-- PASO 1: Corregir el monto del recibo aprobado
-- PASO 2: Re-agregar el descuento de $10,000 para la próxima cuota
-- =============================================================

-- IMPORTANTE: Reemplaza 'XXXXXX' con el ID real de la reservación.
-- Puedes encontrarlo buscando por nombre o lote:
--   SELECT r.id, r.name, r.last_name, l.number, l.stage
--   FROM "Reservation" r
--   JOIN "Lot" l ON r.lot_id = l.id
--   WHERE r.name ILIKE '%NOMBRE_CLIENTE%';

-- Ver los recibos de la clienta para identificar el correcto:
-- SELECT pr.id, pr.amount_clp, pr.scope, pr.status, pr.created_at
-- FROM "PaymentReceipt" pr
-- WHERE pr.reservation_id = 'XXXXXX'
-- ORDER BY pr.created_at DESC;

-- ============================
-- PASO 1: Corregir el monto del recibo
-- Cambiar de $540,000 → $550,000
-- ============================
UPDATE "PaymentReceipt"
SET amount_clp = 550000
WHERE reservation_id = 'XXXXXX'
  AND amount_clp = 540000
  AND status = 'APPROVED'
  AND scope = 'INSTALLMENT'
  -- Si hay múltiples, usar el más reciente:
  AND id = (
    SELECT id FROM "PaymentReceipt"
    WHERE reservation_id = 'XXXXXX'
      AND amount_clp = 540000
      AND status = 'APPROVED'
      AND scope = 'INSTALLMENT'
    ORDER BY created_at DESC
    LIMIT 1
  );

-- ============================
-- PASO 2: Re-agregar el descuento compensatorio
-- para que se aplique en la próxima cuota
-- ============================
UPDATE "Reservation"
SET next_installment_discount = 10000
WHERE id = 'XXXXXX';

-- ============================
-- VERIFICACIÓN
-- ============================
-- SELECT pr.id, pr.amount_clp, pr.status, pr.scope, pr.created_at
-- FROM "PaymentReceipt" pr
-- WHERE pr.reservation_id = 'XXXXXX'
-- ORDER BY pr.created_at DESC;
--
-- SELECT id, name, next_installment_discount
-- FROM "Reservation"
-- WHERE id = 'XXXXXX';
