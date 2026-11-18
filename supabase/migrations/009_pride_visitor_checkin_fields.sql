BEGIN;

ALTER TABLE public.pride_registrations
  ADD COLUMN IF NOT EXISTS visitor_age smallint CHECK (visitor_age BETWEEN 0 AND 120),
  ADD COLUMN IF NOT EXISTS booth_business_name text,
  ADD COLUMN IF NOT EXISTS booth_purpose text,
  ADD COLUMN IF NOT EXISTS booth_catalog_url text;

INSERT INTO public.pride_competitions (id, name, short_name, theme, is_active)
VALUES ('visitor-booth', 'Visitor Booth PRIDE Industri 2026', 'Visitor Booth', 'Presensi Visitor Booth', true)
ON CONFLICT (id) DO NOTHING;

-- Protect new visitor data while legacy public form calls retain their existing policies.
ALTER TABLE public.pride_registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pride_visitor_checkin_server_only ON public.pride_registrations;
CREATE POLICY pride_visitor_checkin_server_only
  ON public.pride_registrations AS RESTRICTIVE FOR ALL TO anon, authenticated
  USING (
    competition_id <> 'visitor-booth'
    AND visitor_age IS NULL
    AND booth_business_name IS NULL
    AND booth_purpose IS NULL
    AND booth_catalog_url IS NULL
  )
  WITH CHECK (
    competition_id <> 'visitor-booth'
    AND visitor_age IS NULL
    AND booth_business_name IS NULL
    AND booth_purpose IS NULL
    AND booth_catalog_url IS NULL
  );

COMMIT;
