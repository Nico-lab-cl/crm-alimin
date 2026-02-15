-- Agrega la columna mustChangePassword a la tabla User
-- Por defecto es falso para los usuarios existentes
ALTER TABLE "User" ADD COLUMN "mustChangePassword" BOOLEAN NOT NULL DEFAULT false;
