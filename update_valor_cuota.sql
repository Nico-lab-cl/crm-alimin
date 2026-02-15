-- 1. Agregar la columna valor_cuota
ALTER TABLE "Lot" ADD COLUMN "valor_cuota" INTEGER;

-- 2. Asignar $550.000 de valor cuota para lotes entre 200 y 299 m2
UPDATE "Lot" 
SET "valor_cuota" = 550000 
WHERE "area_m2" >= 200 AND "area_m2" <= 299;

-- 3. Asignar $550.000 de valor cuota para lotes entre 300 y 399 m2
UPDATE "Lot" 
SET "valor_cuota" = 550000 
WHERE "area_m2" >= 300 AND "area_m2" <= 399;
