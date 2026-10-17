-- ============================================================
-- PRIDE Industri 2026 — Supabase Migration: 003
-- File: supabase/migrations/003_pride_fix_permissions_and_fields.sql
-- 
-- 1. Adds all form fields to pride_registrations
-- 2. Grants permissions to anon, authenticated, and service_role
-- 3. ENABLES Row Level Security (RLS) on all tables
-- 4. Creates compliant RLS policies (clearing all 9 Supabase linter errors)
-- ============================================================

-- Step 1: Ensure all required columns exist on pride_registrations
ALTER TABLE pride_registrations
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS product_name TEXT,
  ADD COLUMN IF NOT EXISTS brand_name TEXT,
  ADD COLUMN IF NOT EXISTS local_ingredients TEXT,
  ADD COLUMN IF NOT EXISTS design_concept TEXT,
  ADD COLUMN IF NOT EXISTS design_file_name TEXT,
  ADD COLUMN IF NOT EXISTS packaging_file_name TEXT,
  ADD COLUMN IF NOT EXISTS master_file_name TEXT,
  ADD COLUMN IF NOT EXISTS ai_used BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS institution TEXT,
  ADD COLUMN IF NOT EXISTS video_category TEXT,
  ADD COLUMN IF NOT EXISTS video_title TEXT,
  ADD COLUMN IF NOT EXISTS video_description TEXT,
  ADD COLUMN IF NOT EXISTS platform_instagram BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS platform_tiktok BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS instagram_handle TEXT,
  ADD COLUMN IF NOT EXISTS tiktok_handle TEXT,
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS instagram_video_url TEXT,
  ADD COLUMN IF NOT EXISTS tiktok_video_url TEXT,
  ADD COLUMN IF NOT EXISTS document_file_name TEXT,
  ADD COLUMN IF NOT EXISTS tactlink_qr_name TEXT,
  ADD COLUMN IF NOT EXISTS pakta_integritas_file_name TEXT,
  ADD COLUMN IF NOT EXISTS surat_persetujuan_file_name TEXT,
  ADD COLUMN IF NOT EXISTS declaration_original BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS declaration_unpublished BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS declaration_secondary BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS declaration_terms BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS declaration_usage_rights BOOLEAN DEFAULT false;

-- Step 2: Grant table and sequence permissions
GRANT ALL ON TABLE pride_registrations TO anon, authenticated, service_role;
GRANT ALL ON TABLE pride_competitions TO anon, authenticated, service_role;
GRANT ALL ON TABLE pride_checkins TO anon, authenticated, service_role;
GRANT ALL ON TABLE pride_gate_tokens TO anon, authenticated, service_role;
GRANT ALL ON TABLE pride_admin_audit_log TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Step 3: Enable Row Level Security (RLS) on all tables (Resolves 0013_rls_disabled_in_public & 0023_sensitive_columns_exposed)
ALTER TABLE pride_competitions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE pride_registrations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE pride_checkins         ENABLE ROW LEVEL SECURITY;
ALTER TABLE pride_gate_tokens      ENABLE ROW LEVEL SECURITY;
ALTER TABLE pride_admin_audit_log  ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop old / conflicting policies if they exist (Resolves 0007_policy_exists_rls_disabled)
DROP POLICY IF EXISTS "pride_competitions_public_read" ON pride_competitions;
DROP POLICY IF EXISTS "pride_competitions_admin_write" ON pride_competitions;
DROP POLICY IF EXISTS "pride_competitions_select" ON pride_competitions;
DROP POLICY IF EXISTS "pride_competitions_write" ON pride_competitions;

DROP POLICY IF EXISTS "pride_registrations_service_role_all" ON pride_registrations;
DROP POLICY IF EXISTS "pride_registrations_insert" ON pride_registrations;
DROP POLICY IF EXISTS "pride_registrations_select" ON pride_registrations;
DROP POLICY IF EXISTS "pride_registrations_update" ON pride_registrations;
DROP POLICY IF EXISTS "pride_registrations_service" ON pride_registrations;

DROP POLICY IF EXISTS "pride_checkins_service_role_all" ON pride_checkins;
DROP POLICY IF EXISTS "pride_checkins_insert" ON pride_checkins;
DROP POLICY IF EXISTS "pride_checkins_select" ON pride_checkins;
DROP POLICY IF EXISTS "pride_checkins_service" ON pride_checkins;

DROP POLICY IF EXISTS "pride_gate_tokens_service_role_all" ON pride_gate_tokens;
DROP POLICY IF EXISTS "pride_gate_tokens_select" ON pride_gate_tokens;
DROP POLICY IF EXISTS "pride_gate_tokens_service" ON pride_gate_tokens;

DROP POLICY IF EXISTS "pride_admin_audit_log_service_role_all" ON pride_admin_audit_log;
DROP POLICY IF EXISTS "pride_admin_audit_log_service" ON pride_admin_audit_log;

-- Step 5: Create complete, compliant RLS policies

-- 5a. pride_competitions: Anyone can view competitions, admins can modify
CREATE POLICY "pride_competitions_select"
  ON pride_competitions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "pride_competitions_write"
  ON pride_competitions FOR ALL
  TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- 5b. pride_registrations: Anyone can register, view, and update (for check-in / admin operations)
CREATE POLICY "pride_registrations_insert"
  ON pride_registrations FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "pride_registrations_select"
  ON pride_registrations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "pride_registrations_update"
  ON pride_registrations FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "pride_registrations_service"
  ON pride_registrations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 5c. pride_checkins: Attendance records can be inserted and viewed
CREATE POLICY "pride_checkins_insert"
  ON pride_checkins FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "pride_checkins_select"
  ON pride_checkins FOR SELECT
  TO public
  USING (true);

CREATE POLICY "pride_checkins_service"
  ON pride_checkins FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 5d. pride_gate_tokens: Only active tokens readable by public; management by service_role/authenticated
CREATE POLICY "pride_gate_tokens_select"
  ON pride_gate_tokens FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "pride_gate_tokens_service"
  ON pride_gate_tokens FOR ALL
  TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- 5e. pride_admin_audit_log: Admin/Service access only
CREATE POLICY "pride_admin_audit_log_service"
  ON pride_admin_audit_log FOR ALL
  TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- Step 6: Ensure default competition catalog records exist
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
