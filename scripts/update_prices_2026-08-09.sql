-- Aplica los precios nuevos (condiciones_venta.pdf) a los 61 lotes
-- disponibles de las etapas 1, 2 y 3.
--
--   Tramo 200 m2 (area 200-299): 54 lotes
--     precio 37.990.000 | pie 5.500.000 | saldo 32.490.000
--     59 cuotas de 550.000 + 1 de 40.000  -> cuotas = 60
--
--   Tramo 390 m2 (area 300-399): 7 lotes
--     precio 45.990.000 | pie 7.500.000 | saldo 38.490.000
--     69 cuotas de 550.000 + 1 de 540.000 -> cuotas = 70
--
-- 'cuotas' guarda el TOTAL incluyendo la ultima; 'last_installment_amount'
-- es el monto de esa ultima cuota. Verificado contra los lotes ya cargados.
--
-- Solo toca status='available'. Los vendidos conservan su precio pactado.
--
-- El precio contado (35.000.000 / 43.000.000) NO va en la base: se muestra
-- en el formulario de reserva y vive en calculateCashPrice(), en
-- src/services/lotSpecs.ts.
--
-- El BLOQUE C corrige el monto de reserva mal cargado de E1-L19 (id 19) y
-- E2-L10 (id 59). NO cambia su estado: siguen disponibles, porque no
-- corresponden a clientes reales. El contador publico no se mueve.
--
-- COMO EJECUTAR EN ADMINER: cada envio abre su propia conexion, asi que el
-- BLOQUE A y el BLOQUE B van pegados completos, cada uno en un envio.

-- #####################################################################
-- BLOQUE A -- respaldo y revision. No modifica datos existentes.
-- #####################################################################

CREATE TABLE "_bkp_lot_precios_20260809" AS
    SELECT * FROM "Lot" WHERE status = 'available';

-- Conteo por tramo. Esperado: 200m2 -> 54, 390m2 -> 7, fuera de rango -> 0.
SELECT CASE
         WHEN area_m2 >= 200 AND area_m2 < 300 THEN 'tramo 200'
         WHEN area_m2 >= 300 AND area_m2 < 400 THEN 'tramo 390'
         ELSE 'FUERA DE RANGO'
       END AS tramo,
       COUNT(*)
FROM "Lot"
WHERE status = 'available'
GROUP BY 1 ORDER BY 1;

-- Anomalias en el monto de reserva (ver notas al final).
SELECT id, stage, number, area_m2, reservation_amount_clp
FROM "Lot"
WHERE status = 'available'
  AND (reservation_amount_clp IS NULL OR reservation_amount_clp <> 500000);


-- #####################################################################
-- BLOQUE B -- aplica los precios nuevos.
-- #####################################################################

BEGIN;

-- Tramo 200 m2
UPDATE "Lot"
SET price_total_clp         = 37990000,
    pie                     = 5500000,
    cuotas                  = 60,
    valor_cuota             = 550000,
    last_installment_amount = 40000,
    updated_at              = NOW()
WHERE status = 'available'
  AND stage <> 4
  AND area_m2 >= 200 AND area_m2 < 300;

-- Tramo 390 m2
UPDATE "Lot"
SET price_total_clp         = 45990000,
    pie                     = 7500000,
    cuotas                  = 70,
    valor_cuota             = 550000,
    last_installment_amount = 540000,
    updated_at              = NOW()
WHERE status = 'available'
  AND stage <> 4
  AND area_m2 >= 300 AND area_m2 < 400;

-- Verificacion: el saldo debe cerrar exacto en los dos tramos.
--   200 m2 -> 59 x 550.000 + 40.000  = 32.490.000
--   390 m2 -> 69 x 550.000 + 540.000 = 38.490.000
SELECT area_m2, price_total_clp, pie, cuotas, valor_cuota, last_installment_amount,
       price_total_clp - pie AS saldo,
       (cuotas - 1) * valor_cuota + last_installment_amount AS suma_cuotas,
       COUNT(*) AS lotes
FROM "Lot"
WHERE status = 'available'
GROUP BY area_m2, price_total_clp, pie, cuotas, valor_cuota, last_installment_amount
ORDER BY area_m2;

COMMIT;
-- Si algo no cuadra, en vez de COMMIT: ROLLBACK;


-- #####################################################################
-- BLOQUE C -- corrige el monto de reserva de E1-L19 (id 19) y E2-L10 (id 59).
--
-- E2-L10 tenia reservation_amount_clp = 1: como el fallback en
-- webpay/create es `lot.reservation_amount_clp || 550000` y 1 es truthy,
-- ese lote cobraba $1 por reservarse. E1-L19 lo tenia en NULL y cobraba
-- 550.000 en vez de 500.000.
--
-- No se cambia el estado: no son clientes reales, siguen disponibles.
-- Tambien se limpian los restos de un checkout abandonado en E2-L10.
-- Ambos ya recibieron el precio del tramo 200 en el bloque B.
-- #####################################################################

BEGIN;

UPDATE "Lot"
SET reservation_amount_clp = 500000,
    reserved_at            = NULL,
    reserved_by            = NULL,
    reserved_until         = NULL,
    order_id               = NULL,
    updated_at             = NOW()
WHERE id IN (19, 59);

-- Verificacion. Esperado: los dos en 'available', reserva 500.000,
-- precio 37.990.000, pie 5.500.000, cuotas 60, ultima 40.000.
SELECT id, stage, number, area_m2, status, reservation_amount_clp,
       price_total_clp, pie, cuotas, valor_cuota, last_installment_amount
FROM "Lot" WHERE id IN (19, 59);

-- Conteo global. Esperado (sin cambios respecto de antes):
--   available 61 | blocked 65 | reserved 1 | sold 75
SELECT status, COUNT(*) FROM "Lot" GROUP BY status ORDER BY status;

COMMIT;
-- Si algo no cuadra: ROLLBACK;


-- #####################################################################
-- REVERTIR (si ya se hizo COMMIT y hay que deshacer)
-- #####################################################################
-- BEGIN;
-- UPDATE "Lot" l
--    SET price_total_clp = b.price_total_clp, pie = b.pie, cuotas = b.cuotas,
--        valor_cuota = b.valor_cuota, last_installment_amount = b.last_installment_amount,
--        reservation_amount_clp = b.reservation_amount_clp, status = b.status
--   FROM "_bkp_lot_precios_20260809" b
--  WHERE l.id = b.id;
-- COMMIT;
