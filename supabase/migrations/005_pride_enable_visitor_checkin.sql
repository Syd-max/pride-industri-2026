-- ============================================================
-- PRIDE Industri 2026 — Migration: 005
-- File: supabase/migrations/005_pride_enable_visitor_checkin.sql
-- 
-- 1. Adds 'pengunjung-umum' to pride_competitions catalog
-- 2. Updates pride_registrations INSERT policy to allow visitor check-ins
-- ============================================================

-- Step 1: Register 'pengunjung-umum' into pride_competitions
INSERT INTO pride_competitions (id, name, short_name, theme, is_active)
VALUES (
  'pengunjung-umum',
  'Pengunjung Umum Festival PRIDE 2026',
  'Pengunjung Festival',
  'Presensi Kehadiran Pengunjung Festival Braga City Walk',
  true
)
ON CONFLICT (id) DO UPDATE SET is_active = true;

-- Step 2: Update pride_registrations INSERT policy to allow visitors
DROP POLICY IF EXISTS "pride_registrations_insert" ON pride_registrations;

CREATE POLICY "pride_registrations_insert"
  ON pride_registrations FOR INSERT
  TO public
  WITH CHECK (
    length(full_name) >= 1 AND
    length(registration_code) >= 6 AND
    competition_id IN ('desain-kemasan', 'video-lokal', 'pengunjung-umum')
  );
