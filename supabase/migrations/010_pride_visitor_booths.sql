BEGIN;

CREATE TABLE IF NOT EXISTS public.visitor_booths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name text NOT NULL CHECK (btrim(brand_name) <> ''),
  logo_path text NOT NULL UNIQUE,
  catalog_path text NOT NULL UNIQUE,
  whatsapp_number text NOT NULL CHECK (whatsapp_number ~ '^[1-9][0-9]{7,14}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (logo_path ~ ('^' || id::text || '/logo-[0-9a-f-]{36}\.(png|jpg|webp)$')),
  CHECK (catalog_path ~ ('^' || id::text || '/catalog-[0-9a-f-]{36}\.pdf$'))
);

ALTER TABLE public.visitor_booths ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.visitor_booths FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.visitor_booths TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.visitor_booths TO authenticated;

DROP POLICY IF EXISTS visitor_booths_public_read ON public.visitor_booths;
CREATE POLICY visitor_booths_public_read ON public.visitor_booths
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS visitor_booths_admin_write ON public.visitor_booths;
CREATE POLICY visitor_booths_admin_write ON public.visitor_booths
  FOR ALL TO authenticated
  USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'pride_role' = 'organizer_admin')
  WITH CHECK ((SELECT auth.jwt()) -> 'app_metadata' ->> 'pride_role' = 'organizer_admin');

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pride-visitor-booths', 'pride-visitor-booths', true, 20971520,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS pride_booth_assets_admin_only ON storage.objects;
CREATE POLICY pride_booth_assets_admin_only ON storage.objects AS RESTRICTIVE
  FOR ALL TO anon, authenticated
  USING (
    bucket_id <> 'pride-visitor-booths'
    OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'pride_role' = 'organizer_admin'
  )
  WITH CHECK (
    bucket_id <> 'pride-visitor-booths'
    OR (
      (SELECT auth.jwt()) -> 'app_metadata' ->> 'pride_role' = 'organizer_admin'
      AND name ~ '^[0-9a-f-]{36}/(logo-[0-9a-f-]{36}\.(png|jpg|webp)|catalog-[0-9a-f-]{36}\.pdf)$'
    )
  );

DROP POLICY IF EXISTS pride_booth_assets_admin_read ON storage.objects;
CREATE POLICY pride_booth_assets_admin_read ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'pride-visitor-booths'
    AND (SELECT auth.jwt()) -> 'app_metadata' ->> 'pride_role' = 'organizer_admin'
  );

DROP POLICY IF EXISTS pride_booth_assets_admin_insert ON storage.objects;
CREATE POLICY pride_booth_assets_admin_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'pride-visitor-booths'
    AND (SELECT auth.jwt()) -> 'app_metadata' ->> 'pride_role' = 'organizer_admin'
  );

DROP POLICY IF EXISTS pride_booth_assets_admin_delete ON storage.objects;
CREATE POLICY pride_booth_assets_admin_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'pride-visitor-booths'
    AND (SELECT auth.jwt()) -> 'app_metadata' ->> 'pride_role' = 'organizer_admin'
  );

COMMIT;
