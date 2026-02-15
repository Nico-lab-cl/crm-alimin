-- Actualizar precios para terrenos de 200m2 a 299m2 (aprox 200m2)
-- Nuevo valor: $35.990.000
UPDATE "Lot"
SET price_total_clp = 35990000
WHERE area_m2 >= 200 AND area_m2 < 300;

-- Actualizar precios para terrenos de 300m2 a 399m2 (aprox 390m2)
-- Nuevo valor: $43.990.000
UPDATE "Lot"
SET price_total_clp = 43990000
WHERE area_m2 >= 300 AND area_m2 < 400;

-- Verificar los cambios (opcional)
-- SELECT id, area_m2, price_total_clp FROM "Lot" WHERE area_m2 >= 200;
