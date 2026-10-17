-- ============================================================
-- PRIDE Industri 2026 — Supabase Migration: 007
-- File: supabase/migrations/007_pride_enable_storage_uploads.sql
-- 
-- 1. Ensures 'community-assets' bucket exists and is public
-- 2. Sets up explicit RLS policies on storage.objects for 'community-assets'
--    allowing registration submissions to upload, read, and manage assets.
-- ============================================================

-- 1. Ensure community-assets bucket exists and is marked public with 50MB limit
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community-assets',
  'community-assets',
  true,
  52428800, -- 50 MB
  ARRAY[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/zip',
    'application/x-zip-compressed',
    'application/vnd.rar',
    'application/x-rar-compressed',
    'application/postscript',
    'image/vnd.adobe.photoshop',
    'application/octet-stream'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/zip',
    'application/x-zip-compressed',
    'application/vnd.rar',
    'application/x-rar-compressed',
    'application/postscript',
    'image/vnd.adobe.photoshop',
    'application/octet-stream'
  ];

-- 2. Allow INSERT (upload) to community-assets for public & authenticated
DROP POLICY IF EXISTS "Allow registration uploads to community-assets" ON storage.objects;
CREATE POLICY "Allow registration uploads to community-assets"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'community-assets');

-- 3. Allow SELECT (view / download) from community-assets
DROP POLICY IF EXISTS "Allow read community-assets" ON storage.objects;
CREATE POLICY "Allow read community-assets"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'community-assets');

-- 4. Allow UPDATE in community-assets
DROP POLICY IF EXISTS "Allow update community-assets" ON storage.objects;
CREATE POLICY "Allow update community-assets"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id = 'community-assets')
  WITH CHECK (bucket_id = 'community-assets');

-- 5. Allow DELETE from community-assets (for rollback / admin cleanup)
DROP POLICY IF EXISTS "Allow delete community-assets" ON storage.objects;
CREATE POLICY "Allow delete community-assets"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'community-assets');
