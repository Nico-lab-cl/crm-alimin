-- Esto buscará todas las reservas de tipo "Offine" (Legacy) 
-- a las cuales ya se les activo el workflow durante las últimas 24 horas
-- y las devolverá a estado "NO ACTIVADO" para que el botón vuelva a aparecer.

UPDATE "Reservation"
SET "workflow_activated" = false
WHERE "is_legacy" = true 
  AND "workflow_activated" = true
  AND "created_at" >= current_date;
