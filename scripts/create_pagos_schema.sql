-- ═══════════════════════════════════════════════════════════════════════════
-- PORTAL DE PAGOS MULTI-PROYECTO — SCHEMA "pagos"
-- Base de datos: db-alimin @ 72.62.11.186
-- Fecha: Abril 2026
-- ═══════════════════════════════════════════════════════════════════════════
-- Este script crea el schema "pagos" separado del schema "public" (Lomas del Mar)
-- para alojar los proyectos: Libertad y Alegría + Arena y Sol
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- ═══════════════════════════════════════════
-- 1. CREAR SCHEMA
-- ═══════════════════════════════════════════
CREATE SCHEMA IF NOT EXISTS pagos;

-- ═══════════════════════════════════════════
-- 2. EXTENSIONES NECESARIAS
-- ═══════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════
-- 3. ENUMS
-- ═══════════════════════════════════════════
DO $$ BEGIN
    CREATE TYPE pagos.user_role AS ENUM ('ADMIN', 'USER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE pagos.action_type AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- 4. TABLA: projects
-- Configuración global por proyecto inmobiliario
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS pagos.projects (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                 VARCHAR(100) UNIQUE NOT NULL,         -- "libertad-y-alegria", "arena-y-sol"
    name                 VARCHAR(255) NOT NULL,                -- "Libertad y Alegría"
    description          TEXT,
    status               VARCHAR(20) DEFAULT 'ACTIVE',         -- ACTIVE, INACTIVE, ARCHIVED

    -- Configuración financiera del proyecto
    grace_period_days    INT DEFAULT 5,                         -- Días de gracia después del vencimiento
    daily_penalty_amount INT DEFAULT 10000,                     -- Multa diaria por mora (CLP)
    due_day_of_month     INT DEFAULT 5,                         -- Día del mes que vencen las cuotas
    penalty_start_date   TIMESTAMP WITH TIME ZONE,              -- Fecha desde la cual aplican intereses

    -- Datos bancarios para transferencias
    bank_name            VARCHAR(100) DEFAULT 'Santander',
    bank_type            VARCHAR(50) DEFAULT 'Corriente',       -- Corriente, Ahorro, Vista
    bank_account         VARCHAR(50) DEFAULT '',
    bank_holder          VARCHAR(255) DEFAULT 'Alimin SPA',
    bank_rut             VARCHAR(20) DEFAULT '77.508.711-0',
    bank_email           VARCHAR(255) DEFAULT 'inmobiliaria@aliminspa.cl',

    created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_projects_slug ON pagos.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON pagos.projects(status);

-- ═══════════════════════════════════════════════════════════════════════════
-- 5. TABLA: lots
-- Cada terreno/parcela dentro de un proyecto
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS pagos.lots (
    id                      SERIAL PRIMARY KEY,
    project_id              UUID NOT NULL REFERENCES pagos.projects(id) ON DELETE CASCADE,
    number                  VARCHAR(20) NOT NULL,               -- "1", "15", "A-3"
    stage                   INT,                                 -- Etapa (null si no tiene)
    area_m2                 REAL,                                -- Superficie en m²
    price_total_clp         INT,                                 -- Valor total del terreno
    reservation_amount_clp  INT DEFAULT 0,                       -- Monto de reserva
    pie                     INT DEFAULT 0,                       -- Pie (enganche)
    cuotas                  INT,                                 -- Número total de cuotas
    valor_cuota             INT,                                 -- Valor de cada cuota mensual
    last_installment_amount INT,                                 -- Valor de la última cuota (si difiere)
    status                  VARCHAR(20) DEFAULT 'available',     -- available, sold, blocked

    created_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Un lote es único por proyecto + número + etapa
    UNIQUE(project_id, number, stage)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_lots_project ON pagos.lots(project_id);
CREATE INDEX IF NOT EXISTS idx_lots_status ON pagos.lots(status);
CREATE INDEX IF NOT EXISTS idx_lots_stage ON pagos.lots(stage);

-- ═══════════════════════════════════════════════════════════════════════════
-- 6. TABLA: users
-- Usuarios del portal (compradores y admins)
-- Tabla SEPARADA del schema public (Lomas del Mar tiene sus propios users)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS pagos.users (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email                VARCHAR(255) UNIQUE NOT NULL,
    email_verified       TIMESTAMP WITH TIME ZONE,
    password             VARCHAR(255) NOT NULL,
    name                 VARCHAR(255) NOT NULL,
    role                 pagos.user_role DEFAULT 'USER',
    must_change_password BOOLEAN DEFAULT FALSE,

    -- Permisos por proyecto (JSON array de project slugs que puede gestionar)
    -- null = acceso a todos los proyectos (superadmin)
    allowed_projects     JSONB,                                  -- ["libertad-y-alegria"] o null para todos

    created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_users_email ON pagos.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON pagos.users(role);

-- ═══════════════════════════════════════════════════════════════════════════
-- 7. TABLA: reservations
-- Vínculo comprador ↔ lote con toda la data financiera
-- Esta es la tabla más importante del sistema
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS pagos.reservations (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id           UUID NOT NULL REFERENCES pagos.projects(id) ON DELETE CASCADE,
    lot_id               INT NOT NULL REFERENCES pagos.lots(id) ON DELETE CASCADE,
    user_id              UUID NOT NULL REFERENCES pagos.users(id) ON DELETE CASCADE,

    -- Datos del cliente (denormalizados para acceso rápido)
    name                 VARCHAR(255) NOT NULL,
    last_name            VARCHAR(255),
    email                VARCHAR(255) NOT NULL,
    phone                VARCHAR(50) NOT NULL,
    rut                  VARCHAR(20),

    -- Estado general
    status               VARCHAR(20) DEFAULT 'active',          -- active, completed, cancelled

    -- ═══ ESTADO DE PAGOS ═══
    pie_status           VARCHAR(20) DEFAULT 'PENDING',         -- PENDING, PAID
    installments_paid    INT DEFAULT 0,                          -- Cuotas ya pagadas

    -- Financiamiento personalizado (override de los valores del lote)
    pie                  INT DEFAULT 0,                          -- Pie pagado por este cliente (puede diferir del lote)
    extra_paid_amount    INT DEFAULT 0,                          -- Pagos extra que el cliente haya hecho
    pending_amount       INT DEFAULT 0,                          -- Deuda pendiente adicional

    -- ═══ CONTROL DE FECHAS DE CUOTAS ═══
    installment_start_date  TIMESTAMP WITH TIME ZONE,            -- Fecha base para calcular cuotas
    installment_ranges      JSONB,                               -- [{from, to, amount}] cuotas con montos variables
    debt_start_date         TIMESTAMP WITH TIME ZONE,            -- Inicio manual de deuda por mora
    debt_end_date           TIMESTAMP WITH TIME ZONE,            -- Fin manual de deuda por mora (Opcional)
    next_payment_date       TIMESTAMP WITH TIME ZONE,            -- Override manual por admin

    -- ═══ CONTROL ADMIN ═══
    mora_frozen          BOOLEAN DEFAULT FALSE,                  -- Congelar cálculo de mora
    advisor              VARCHAR(100),                            -- Asesor asignado
    observation          TEXT,                                    -- Observaciones internas
    notes                TEXT,                                    -- Notas adicionales

    -- ═══ DOCUMENTOS ═══
    manual_documents     JSONB,                                  -- [{name, url, category, uploadedAt}]
    uploaded_contracts   JSONB,                                  -- [{name, url}] contratos subidos

    -- ═══ DATOS PERSONALES DEL CLIENTE ═══
    address_street       VARCHAR(255),
    address_number       VARCHAR(20),
    address_commune      VARCHAR(100),
    address_region       VARCHAR(100),
    marital_status       VARCHAR(50),
    profession           VARCHAR(100),
    nationality          VARCHAR(100) DEFAULT 'Chilena',

    created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_reservations_project ON pagos.reservations(project_id);
CREATE INDEX IF NOT EXISTS idx_reservations_lot ON pagos.reservations(lot_id);
CREATE INDEX IF NOT EXISTS idx_reservations_user ON pagos.reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON pagos.reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_pie_status ON pagos.reservations(pie_status);

-- ═══════════════════════════════════════════════════════════════════════════
-- 8. TABLA: payment_receipts
-- Comprobantes de pago (transferencias bancarias)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS pagos.payment_receipts (
    id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id             UUID NOT NULL REFERENCES pagos.reservations(id) ON DELETE CASCADE,
    lot_id                     INT NOT NULL REFERENCES pagos.lots(id) ON DELETE CASCADE,

    amount_clp                 INT NOT NULL,                      -- Monto pagado
    status                     VARCHAR(20) DEFAULT 'PENDING',     -- PENDING, APPROVED, REJECTED
    receipt_url                TEXT NOT NULL,                      -- URL o Base64 del comprobante
    scope                      VARCHAR(30) NOT NULL,              -- PIE, INSTALLMENT, OTHERS

    -- Metadata de cuotas
    installments_count         INT DEFAULT 1,                     -- Cuántas cuotas cubre este pago
    nominal_installment_number INT,                               -- Cuota nominal (ej: cuota #8)
    nominal_installment_range  VARCHAR(20),                       -- Rango (ej: "4-5")

    -- Rechazo
    rejection_reason           TEXT,                              -- Razón si fue rechazado

    created_at                 TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at               TIMESTAMP WITH TIME ZONE           -- Fecha de aprobación/rechazo
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_receipts_reservation ON pagos.payment_receipts(reservation_id);
CREATE INDEX IF NOT EXISTS idx_receipts_lot ON pagos.payment_receipts(lot_id);
CREATE INDEX IF NOT EXISTS idx_receipts_status ON pagos.payment_receipts(status);
CREATE INDEX IF NOT EXISTS idx_receipts_scope ON pagos.payment_receipts(scope);

-- ═══════════════════════════════════════════════════════════════════════════
-- 9. TABLA: audit_logs
-- Registro de todas las acciones de admin
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS pagos.audit_logs (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action               pagos.action_type NOT NULL,
    entity               VARCHAR(100) NOT NULL,                  -- "reservation", "lot", "payment_receipt"
    entity_id            VARCHAR(100),                           -- ID de la entidad afectada
    details              TEXT,                                   -- Descripción de la acción
    user_id              UUID REFERENCES pagos.users(id) ON DELETE SET NULL,
    user_email           VARCHAR(255),
    ip_address           VARCHAR(50),
    user_agent           TEXT,

    created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_audit_user ON pagos.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON pagos.audit_logs(entity);
CREATE INDEX IF NOT EXISTS idx_audit_created ON pagos.audit_logs(created_at DESC);

-- ═══════════════════════════════════════════════════════════════════════════
-- 10. TABLA: notifications
-- Notificaciones para usuarios del portal
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS pagos.notifications (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID NOT NULL REFERENCES pagos.users(id) ON DELETE CASCADE,
    type                 VARCHAR(50) NOT NULL,                   -- payment_due, payment_approved, payment_rejected, document_added
    title                VARCHAR(255) NOT NULL,
    message              TEXT NOT NULL,
    read                 BOOLEAN DEFAULT FALSE,

    created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_notifications_user ON pagos.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON pagos.notifications(read);

-- ═══════════════════════════════════════════════════════════════════════════
-- 11. TRIGGER: auto-update updated_at
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION pagos.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a tablas que necesitan updated_at automático
DO $$ 
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY['projects', 'lots', 'users', 'reservations']
    LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS trigger_update_%I ON pagos.%I; 
             CREATE TRIGGER trigger_update_%I 
             BEFORE UPDATE ON pagos.%I 
             FOR EACH ROW EXECUTE FUNCTION pagos.update_updated_at_column()',
            tbl, tbl, tbl, tbl
        );
    END LOOP;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- 12. SEED DATA: Proyectos
-- ═══════════════════════════════════════════════════════════════════════════

-- Proyecto: Libertad y Alegría
INSERT INTO pagos.projects (slug, name, description, grace_period_days, daily_penalty_amount, due_day_of_month)
VALUES (
    'libertad-y-alegria',
    'Libertad y Alegría',
    'Proyecto inmobiliario Libertad y Alegría — Portal de Pagos',
    5,       -- Días de gracia (placeholder — ajustar cuando llegue la info)
    10000,   -- Multa diaria (placeholder — ajustar cuando llegue la info)
    5        -- Vencimiento día 5 (placeholder — ajustar cuando llegue la info)
)
ON CONFLICT (slug) DO NOTHING;

-- Proyecto: Arena y Sol
INSERT INTO pagos.projects (slug, name, description, grace_period_days, daily_penalty_amount, due_day_of_month)
VALUES (
    'arena-y-sol',
    'Arena y Sol',
    'Proyecto inmobiliario Arena y Sol — Portal de Pagos',
    5,
    10000,
    5
)
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- 13. SEED DATA: Usuarios Admin
-- ═══════════════════════════════════════════════════════════════════════════

-- Admin para Libertad y Alegría
INSERT INTO pagos.users (email, password, name, role, must_change_password, allowed_projects)
VALUES (
    'postventa@libertadyalegria.cl',
    '$2b$10$7E6yEMtrK/zP1TBjz5juMegPCfAkck7JmexSUb5.P3RHt.KLRvWyW',  -- postventa321
    'Postventa Libertad y Alegría',
    'ADMIN',
    FALSE,
    '["libertad-y-alegria"]'::jsonb
)
ON CONFLICT (email) DO NOTHING;

-- Admin para Arena y Sol (+ Lomas del Mar en el otro portal)
INSERT INTO pagos.users (email, password, name, role, must_change_password, allowed_projects)
VALUES (
    'postventa@lomasdelmar.cl',
    '$2b$10$Ht0uTVMaCptuPVddPB2i0.CGSns5F5kL2OEZKlqakajbu8eT7p.rS',  -- postventa123
    'Postventa Arena y Sol',
    'ADMIN',
    FALSE,
    '["arena-y-sol"]'::jsonb
)
ON CONFLICT (email) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- 14. VIEWS ÚTILES
-- ═══════════════════════════════════════════════════════════════════════════

-- Vista: Resumen de lotes por proyecto
CREATE OR REPLACE VIEW pagos.v_lot_summary AS
SELECT
    p.slug AS project_slug,
    p.name AS project_name,
    COUNT(*) AS total_lots,
    COUNT(*) FILTER (WHERE l.status = 'available') AS available,
    COUNT(*) FILTER (WHERE l.status = 'sold') AS sold,
    COUNT(*) FILTER (WHERE l.status = 'blocked') AS blocked
FROM pagos.lots l
JOIN pagos.projects p ON p.id = l.project_id
GROUP BY p.slug, p.name;

-- Vista: Resumen financiero por cliente
CREATE OR REPLACE VIEW pagos.v_client_financial AS
SELECT
    r.id AS reservation_id,
    p.slug AS project_slug,
    p.name AS project_name,
    l.number AS lot_number,
    l.stage AS lot_stage,
    r.name AS client_name,
    r.last_name AS client_last_name,
    r.email AS client_email,
    r.phone AS client_phone,
    r.rut AS client_rut,
    l.price_total_clp AS total_price,
    COALESCE(r.pie, l.pie, 0) AS pie_amount,
    r.pie_status,
    r.installments_paid,
    COALESCE(l.cuotas, 0) AS total_installments,
    COALESCE(l.valor_cuota, 0) AS installment_value,
    r.mora_frozen,
    r.installment_start_date,
    r.debt_end_date,
    r.next_payment_date,
    r.created_at
FROM pagos.reservations r
JOIN pagos.projects p ON p.id = r.project_id
JOIN pagos.lots l ON l.id = r.lot_id
WHERE r.status = 'active';

COMMIT;

-- ═══════════════════════════════════════════════════════════════════════════
-- ✅ VERIFICACIÓN: Ejecutar después de crear el schema
-- ═══════════════════════════════════════════════════════════════════════════
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'pagos' ORDER BY table_name;
-- SELECT * FROM pagos.projects;
-- SELECT id, email, name, role, allowed_projects FROM pagos.users;
