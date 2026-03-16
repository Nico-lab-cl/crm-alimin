-- ACTUALIZACIÓN DE VALORES - TERRENOS DISPONIBLES
-- Ejecutar en la base de datos db-alimin

-- 1. Actualizar Terrenos de 200 m² (basado en área < 300 m²)
-- Valores: CLP 35.990.000, Pie 1.500.000, Cuota 550.000, 63 cuotas, última cuota 390.000
UPDATE "Lot"
SET
  price_total_clp = 35990000,
  pie = 1500000,
  valor_cuota = 550000,
  cuotas = 63,
  last_installment_amount = 390000
WHERE status = 'available' AND area_m2 < 300;

-- 2. Actualizar Terrenos de 390 m² (basado en área >= 300 m²)
-- Valores: CLP 44.990.000, Pie 3.500.000, Cuota 550.000, 76 cuotas, última cuota 240.000
UPDATE "Lot"
SET
  price_total_clp = 44990000,
  pie = 3500000,
  valor_cuota = 550000,
  cuotas = 76,
  last_installment_amount = 240000
WHERE status = 'available' AND area_m2 >= 300;
