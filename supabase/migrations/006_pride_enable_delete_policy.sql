-- ============================================================
-- PRIDE Industri 2026 — Migration: 006
-- File: supabase/migrations/006_pride_enable_delete_policy.sql
-- 
-- Adds explicit DELETE RLS policies for pride_registrations and pride_checkins
-- so that records can be deleted directly by admin operations.
-- ============================================================

-- 1. Allow DELETE on pride_registrations
DROP POLICY IF EXISTS "pride_registrations_delete" ON pride_registrations;

CREATE POLICY "pride_registrations_delete"
  ON pride_registrations FOR DELETE
  TO public
  USING (true);

-- 2. Allow DELETE on pride_checkins
DROP POLICY IF EXISTS "pride_checkins_delete" ON pride_checkins;

CREATE POLICY "pride_checkins_delete"
  ON pride_checkins FOR DELETE
  TO public
  USING (true);
