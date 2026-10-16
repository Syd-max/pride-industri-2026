-- ============================================================
-- PRIDE Industri 2026 — Supabase Database Migration
-- Migration: 002_pride_video_lokal_fields.sql
-- 
-- Adds fields for Video Lokal 17-point registration specification:
-- Institution, title, description, platforms, handles, URLs,
-- usage rights declaration, and uploaded document filenames.
-- ============================================================

ALTER TABLE pride_registrations
  ADD COLUMN IF NOT EXISTS institution TEXT,
  ADD COLUMN IF NOT EXISTS video_title TEXT,
  ADD COLUMN IF NOT EXISTS video_description TEXT,
  ADD COLUMN IF NOT EXISTS platform_instagram BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS platform_tiktok BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS instagram_video_url TEXT,
  ADD COLUMN IF NOT EXISTS tiktok_video_url TEXT,
  ADD COLUMN IF NOT EXISTS declaration_usage_rights BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS pakta_integritas_file_name TEXT,
  ADD COLUMN IF NOT EXISTS surat_persetujuan_file_name TEXT;
