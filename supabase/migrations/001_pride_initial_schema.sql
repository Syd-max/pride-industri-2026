-- ============================================================
-- PRIDE Industri 2026 — Supabase Database Migration
-- Migration: 001_pride_initial_schema.sql
-- 
-- ⚠️  SAFETY: This migration ONLY creates new tables prefixed
--     with "pride_". It does NOT touch any existing tables.
--     Safe to run on an existing Supabase project (e.g. Indscript).
-- ============================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Table: pride_competitions ────────────────────────────────────────────────
-- Catalog of competition types. Seeded via migration.
CREATE TABLE IF NOT EXISTS pride_competitions (
  id           TEXT PRIMARY KEY,           -- 'desain-kemasan' | 'video-lokal'
  name         TEXT NOT NULL,
  short_name   TEXT NOT NULL,
  theme        TEXT NOT NULL,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed competition catalog
INSERT INTO pride_competitions (id, name, short_name, theme)
VALUES
  (
    'desain-kemasan',
    'Lomba Desain Kemasan PRIDE Industri 2026',
    'Desain Kemasan',
    'Inovasi Desain Kemasan Ramah Lingkungan untuk Produk Kuliner Berbahan Dasar Lokal'
  ),
  (
    'video-lokal',
    'Lomba Video 1 Menit (60 Detik) PRIDE Industri 2026',
    'Video Lokal',
    'Karya Lokal, Cerita Lokal'
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Table: pride_registrations ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pride_registrations (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_code    TEXT NOT NULL UNIQUE,   -- e.g. PRIDE-DK-20261021-AB1C2D
  competition_id       TEXT NOT NULL REFERENCES pride_competitions(id),

  -- Personal information
  full_name            TEXT NOT NULL,
  email                TEXT NOT NULL,
  phone                TEXT NOT NULL,

  -- Desain Kemasan specific
  address              TEXT,
  product_name         TEXT,
  brand_name           TEXT,
  local_ingredients    TEXT,
  ai_used              BOOLEAN,

  -- Video Lokal specific
  instagram_handle     TEXT,
  tiktok_handle        TEXT,
  video_category       TEXT,   -- 'Fesyen' | 'Kuliner' | 'Kriya' | 'PRIDE Industri 2026'
  video_url            TEXT,

  -- Declarations (stored for audit purposes)
  declaration_original    BOOLEAN NOT NULL DEFAULT false,
  declaration_secondary   BOOLEAN NOT NULL DEFAULT false,
  declaration_terms       BOOLEAN NOT NULL DEFAULT false,

  -- Status
  status               TEXT NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'confirmed', 'finalist', 'disqualified', 'cancelled')),
  check_in_status      TEXT NOT NULL DEFAULT 'not_checked_in'
                         CHECK (check_in_status IN ('not_checked_in', 'checked_in')),
  checked_in_at        TIMESTAMPTZ,

  -- Metadata
  ip_address           INET,                   -- for duplicate detection
  user_agent           TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent duplicate registrations per email per competition
CREATE UNIQUE INDEX IF NOT EXISTS pride_registrations_email_competition_unique
  ON pride_registrations (LOWER(email), competition_id)
  WHERE status NOT IN ('cancelled', 'disqualified');

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS pride_registrations_competition_idx
  ON pride_registrations (competition_id);
CREATE INDEX IF NOT EXISTS pride_registrations_status_idx
  ON pride_registrations (status);
CREATE INDEX IF NOT EXISTS pride_registrations_checkin_idx
  ON pride_registrations (check_in_status);
CREATE INDEX IF NOT EXISTS pride_registrations_created_at_idx
  ON pride_registrations (created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION pride_update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER pride_registrations_updated_at
  BEFORE UPDATE ON pride_registrations
  FOR EACH ROW EXECUTE FUNCTION pride_update_updated_at();

-- ─── Table: pride_gate_tokens ─────────────────────────────────────────────────
-- QR tokens placed at event gates. Admin creates and manages these.
CREATE TABLE IF NOT EXISTS pride_gate_tokens (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token        TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  label        TEXT NOT NULL,           -- e.g. 'Gate Utama Hari 1'
  is_active    BOOLEAN NOT NULL DEFAULT true,
  valid_from   TIMESTAMPTZ NOT NULL,
  valid_until  TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT pride_gate_token_date_check CHECK (valid_until > valid_from)
);

CREATE INDEX IF NOT EXISTS pride_gate_tokens_active_idx
  ON pride_gate_tokens (is_active, valid_from, valid_until);

-- ─── Table: pride_checkins ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pride_checkins (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id  UUID NOT NULL REFERENCES pride_registrations(id),
  gate_token_id    UUID NOT NULL REFERENCES pride_gate_tokens(id),
  source           TEXT NOT NULL DEFAULT 'qr_scan'
                     CHECK (source IN ('qr_scan', 'manual_admin')),
  checked_in_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent duplicate check-ins per registration per day
CREATE UNIQUE INDEX IF NOT EXISTS pride_checkins_registration_unique
  ON pride_checkins (registration_id, DATE(checked_in_at AT TIME ZONE 'Asia/Jakarta'));

CREATE INDEX IF NOT EXISTS pride_checkins_registration_idx
  ON pride_checkins (registration_id);
CREATE INDEX IF NOT EXISTS pride_checkins_created_at_idx
  ON pride_checkins (created_at DESC);

-- ─── Table: pride_admin_audit_log ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pride_admin_audit_log (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id     UUID,                    -- Supabase auth.users id
  action       TEXT NOT NULL,
  target_table TEXT,
  target_id    TEXT,
  details      JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE pride_competitions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE pride_registrations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE pride_gate_tokens      ENABLE ROW LEVEL SECURITY;
ALTER TABLE pride_checkins         ENABLE ROW LEVEL SECURITY;
ALTER TABLE pride_admin_audit_log  ENABLE ROW LEVEL SECURITY;

-- pride_competitions: public read, no public write
CREATE POLICY "pride_competitions_public_read"
  ON pride_competitions FOR SELECT
  USING (true);

CREATE POLICY "pride_competitions_admin_write"
  ON pride_competitions FOR ALL
  USING (auth.role() = 'service_role');

-- pride_registrations: public INSERT only (registration), no public SELECT/UPDATE
-- Note: INSERT is via service_role from API routes (no client-side direct insert)
CREATE POLICY "pride_registrations_service_role_all"
  ON pride_registrations FOR ALL
  USING (auth.role() = 'service_role');

-- Participants can SELECT their own registration by code (used in check-in flow)
-- We do NOT expose raw registration rows to public — all access via service_role API routes.

-- pride_gate_tokens: service_role only
CREATE POLICY "pride_gate_tokens_service_role_all"
  ON pride_gate_tokens FOR ALL
  USING (auth.role() = 'service_role');

-- pride_checkins: service_role only
CREATE POLICY "pride_checkins_service_role_all"
  ON pride_checkins FOR ALL
  USING (auth.role() = 'service_role');

-- pride_admin_audit_log: service_role only
CREATE POLICY "pride_admin_audit_log_service_role_all"
  ON pride_admin_audit_log FOR ALL
  USING (auth.role() = 'service_role');

-- ─── Comments ─────────────────────────────────────────────────────────────────
COMMENT ON TABLE pride_competitions IS 'PRIDE Industri 2026 — Competition catalog (Desain Kemasan, Video Lokal)';
COMMENT ON TABLE pride_registrations IS 'PRIDE Industri 2026 — Participant registrations';
COMMENT ON TABLE pride_gate_tokens IS 'PRIDE Industri 2026 — QR gate tokens for check-in validation';
COMMENT ON TABLE pride_checkins IS 'PRIDE Industri 2026 — Attendance records';
COMMENT ON TABLE pride_admin_audit_log IS 'PRIDE Industri 2026 — Admin action audit log';
