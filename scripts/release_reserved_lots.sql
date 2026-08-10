-- Libera 12 lotes que quedaron en 'reserved' por compras de prueba y los
-- devuelve a 'available'.
--
--   Etapa 2: L9 (58), L17 (66), L18 (67), L20 (69)
--   Etapa 3: L15 (107), L16 (108), L17 (109), L22 (114),
--            L28 (120), L31 (123), L32 (124), L34 (126)
--
-- NO incluye E3-L18 (id 110): tiene un checkout pending_payment.
-- NO toca precios: la actualizacion de precios va aparte.
--
-- Base: db-alimin, schema public. Las comillas dobles son obligatorias
-- (los nombres de tabla son PascalCase).
--
-- COMO EJECUTAR EN ADMINER: cada envio abre su propia conexion, asi que un
-- BEGIN en un envio y el COMMIT en otro NO funcionan. Hay que pegar el
-- BLOQUE A completo en un envio, revisar la salida, y recien despues pegar
-- el BLOQUE B completo en otro envio.


-- #####################################################################
-- BLOQUE A -- respaldo y revision. No modifica datos existentes.
-- #####################################################################

-- =====================================================================
-- PASO 1: respaldo. Deja la operacion reversible.
-- =====================================================================
CREATE TABLE "_bkp_lot_20260809" AS
    SELECT * FROM "Lot"
    WHERE id IN (58,66,67,69,107,108,109,114,120,123,124,126);

CREATE TABLE "_bkp_reservation_20260809" AS
    SELECT * FROM "Reservation"
    WHERE lot_id IN (58,66,67,69,107,108,109,114,120,123,124,126);

CREATE TABLE "_bkp_webpaytransaction_20260809" AS
    SELECT * FROM "WebpayTransaction"
    WHERE lot_id IN (58,66,67,69,107,108,109,114,120,123,124,126);

CREATE TABLE "_bkp_paymentreceipt_20260809" AS
    SELECT * FROM "PaymentReceipt"
    WHERE lot_id IN (58,66,67,69,107,108,109,114,120,123,124,126);


-- =====================================================================
-- PASO 2: revisar lo que se va a borrar. Deben ser 12 lotes.
-- =====================================================================
SELECT l.id, l.stage, l.number, r.id AS reserva_id, r.status, r.name, r.email
FROM "Lot" l
LEFT JOIN "Reservation" r ON r.lot_id = l.id
WHERE l.id IN (58,66,67,69,107,108,109,114,120,123,124,126)
ORDER BY l.stage, l.id, r.created_at;


-- =====================================================================
-- PASO 3: ALTO. Si esta consulta devuelve filas, hubo un cobro real en
-- Webpay sobre alguno de estos lotes. Revisar antes de continuar
-- (TBK_ENV esta en production, no es plata de juguete).
-- =====================================================================
SELECT t.lot_id, t.reservation_id, t.amount_clp, t.authorization_code, t.transaction_date
FROM "WebpayTransaction" t
WHERE t.lot_id IN (58,66,67,69,107,108,109,114,120,123,124,126)
  AND t.status = 'AUTHORIZED'
  AND t.response_code = 0;


-- #####################################################################
-- BLOQUE B -- destructivo. Pegar completo, en un solo envio, despues de
-- haber revisado la salida del BLOQUE A.
-- #####################################################################

BEGIN;

-- =====================================================================
-- PASO 4: borrar en orden hijo -> padre. Las FK son RESTRICT, no CASCADE,
-- asi que el orden importa: un DELETE directo sobre "Reservation" falla.
-- =====================================================================
DELETE FROM "PaymentReceipt"
 WHERE lot_id IN (58,66,67,69,107,108,109,114,120,123,124,126);

DELETE FROM "WebpayTransaction"
 WHERE lot_id IN (58,66,67,69,107,108,109,114,120,123,124,126);

DELETE FROM "Reservation"
 WHERE lot_id IN (58,66,67,69,107,108,109,114,120,123,124,126);

DELETE FROM "LotLock"
 WHERE lot_id IN (58,66,67,69,107,108,109,114,120,123,124,126);


-- =====================================================================
-- PASO 5: liberar los lotes.
-- =====================================================================
UPDATE "Lot"
SET status         = 'available',
    reserved_at    = NULL,
    reserved_by    = NULL,
    reserved_until = NULL,
    order_id       = NULL,
    updated_at     = NOW()
WHERE id IN (58,66,67,69,107,108,109,114,120,123,124,126);


-- =====================================================================
-- PASO 6: verificar. Esperado:
--   available 61 | blocked 65 | reserved 1 | sold 75
-- El unico 'reserved' que debe quedar es E3-L18 (id 110).
-- =====================================================================
SELECT status, COUNT(*) FROM "Lot" GROUP BY status ORDER BY status;

SELECT id, stage, number, status FROM "Lot" WHERE status = 'reserved';

-- Si cuadra:
COMMIT;
-- Si no cuadra:
-- ROLLBACK;


-- =====================================================================
-- REVERTIR (solo si ya se hizo COMMIT y hay que deshacer)
-- =====================================================================
-- BEGIN;
-- INSERT INTO "Reservation"        SELECT * FROM "_bkp_reservation_20260809";
-- INSERT INTO "WebpayTransaction"  SELECT * FROM "_bkp_webpaytransaction_20260809";
-- INSERT INTO "PaymentReceipt"     SELECT * FROM "_bkp_paymentreceipt_20260809";
-- UPDATE "Lot" l
--    SET status = b.status, reserved_at = b.reserved_at, reserved_by = b.reserved_by,
--        reserved_until = b.reserved_until, order_id = b.order_id
--   FROM "_bkp_lot_20260809" b
--  WHERE l.id = b.id;
-- COMMIT;

-- =====================================================================
-- LIMPIEZA (cuando ya no se necesiten los respaldos)
-- =====================================================================
-- DROP TABLE "_bkp_lot_20260809", "_bkp_reservation_20260809",
--            "_bkp_webpaytransaction_20260809", "_bkp_paymentreceipt_20260809";
