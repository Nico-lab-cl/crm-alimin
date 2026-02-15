-- 1. Agregar la columna pie
ALTER TABLE "Lot" ADD COLUMN "pie" INTEGER;

-- 2. Asignar $1.000.000 de pie para lotes entre 200 y 299 m2
UPDATE "Lot" 
SET "pie" = 1000000 
WHERE "area_m2" >= 200 AND "area_m2" <= 299;

-- 3. Asignar $2.000.000 de pie para lotes entre 300 y 399 m2
UPDATE "Lot" 
SET "pie" = 2000000 
WHERE "area_m2" >= 300 AND "area_m2" <= 399;
