-- 1. Actualizar Terrenos de 200 m² (basado en área < 300 m²)
-- Incluye disponibles y reservados con fecha de expiración pasada.
UPDATE "Lot"
SET
  price_total_clp = 35990000,
  pie = 1500000,
  valor_cuota = 550000,
  cuotas = 63,
  last_installment_amount = 390000
WHERE status != 'sold' AND area_m2 < 300;

-- 2. Actualizar Terrenos de 390 m² (basado en área >= 300 m²)
UPDATE "Lot"
SET
  price_total_clp = 44990000,
  pie = 3500000,
  valor_cuota = 550000,
  cuotas = 76,
  last_installment_amount = 240000
WHERE status != 'sold' AND area_m2 >= 300;
