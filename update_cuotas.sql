-- 1. Agregar la columna cuotas
ALTER TABLE "Lot" ADD COLUMN "cuotas" INTEGER;

-- 2. Asignar 64 cuotas para lotes entre 200 y 299 m2
UPDATE "Lot" 
SET "cuotas" = 64 
WHERE "area_m2" >= 200 AND "area_m2" <= 299;

-- 3. Asignar 78 cuotas para lotes entre 300 y 399 m2
UPDATE "Lot" 
SET "cuotas" = 78 
WHERE "area_m2" >= 300 AND "area_m2" <= 399;
