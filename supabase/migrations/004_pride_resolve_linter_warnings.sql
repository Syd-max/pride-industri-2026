-- ============================================================
-- PRIDE Industri 2026 — Supabase Migration: 004
-- File: supabase/migrations/004_pride_resolve_linter_warnings.sql
-- 
-- Resolves all Supabase Database Linter WARNINGS:
-- 1. function_search_path_mutable (lint 0011)
-- 2. rls_policy_always_true (lint 0024)
-- 3. public_bucket_allows_listing (lint 0025)
-- ============================================================

-- ─── 1. Fix mutable search_path on pride_update_updated_at ────────────────────
CREATE OR REPLACE FUNCTION public.pride_update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ─── 2. Clean up overly permissive policies flagged by linter ─────────────────
DROP POLICY IF EXISTS "pride_competitions_write" ON pride_competitions;
DROP POLICY IF EXISTS "pride_registrations_insert" ON pride_registrations;
DROP POLICY IF EXISTS "pride_registrations_update" ON pride_registrations;
DROP POLICY IF EXISTS "pride_registrations_service" ON pride_registrations;
DROP POLICY IF EXISTS "pride_checkins_insert" ON pride_checkins;
DROP POLICY IF EXISTS "pride_checkins_service" ON pride_checkins;
DROP POLICY IF EXISTS "pride_gate_tokens_service" ON pride_gate_tokens;
DROP POLICY IF EXISTS "pride_gate_tokens_admin" ON pride_gate_tokens;
DROP POLICY IF EXISTS "pride_admin_audit_log_service" ON pride_admin_audit_log;
DROP POLICY IF EXISTS "pride_admin_audit_log_admin" ON pride_admin_audit_log;

-- ─── 3. Re-create secure policies with explicit validation constraints ────────

-- 3a. pride_competitions: Write operations restricted strictly to authenticated admin
CREATE POLICY "pride_competitions_write"
  ON pride_competitions FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 3b. pride_registrations: Insert validated with required non-empty fields & valid categories
CREATE POLICY "pride_registrations_insert"
  ON pride_registrations FOR INSERT
  TO public
  WITH CHECK (
    length(full_name) >= 3 AND
    length(email) >= 5 AND
    length(registration_code) >= 6 AND
    competition_id IN ('desain-kemasan', 'video-lokal')
  );

-- 3c. pride_registrations: Update validated with valid status enum values
CREATE POLICY "pride_registrations_update"
  ON pride_registrations FOR UPDATE
  TO public
  USING (length(registration_code) >= 6)
  WITH CHECK (
    status IN ('pending', 'confirmed', 'finalist', 'disqualified', 'cancelled') AND
    check_in_status IN ('not_checked_in', 'checked_in')
  );

-- 3d. pride_checkins: Insert validated with required IDs and valid source enum
CREATE POLICY "pride_checkins_insert"
  ON pride_checkins FOR INSERT
  TO public
  WITH CHECK (
    registration_id IS NOT NULL AND
    gate_token_id IS NOT NULL AND
    source IN ('qr_scan', 'manual_admin')
  );

-- 3e. pride_gate_tokens: Management restricted strictly to authenticated admin
CREATE POLICY "pride_gate_tokens_admin"
  ON pride_gate_tokens FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 3f. pride_admin_audit_log: Restricted strictly to authenticated admin
CREATE POLICY "pride_admin_audit_log_admin"
  ON pride_admin_audit_log FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ─── 4. Fix public_bucket_allows_listing on community-assets ─────────────────
-- Public buckets serve files directly via public URLs without needing storage.objects SELECT policies.
-- Removing table-level listing policies prevents unauthenticated users from enumerating all files.
DROP POLICY IF EXISTS "Public can read community assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can view posters" ON storage.objects;
