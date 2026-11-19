BEGIN;

CREATE TABLE IF NOT EXISTS public.visitor_form_submissions (
  id uuid PRIMARY KEY,
  visitor_type text NOT NULL CHECK (visitor_type IN ('booth', 'umum')),
  full_name text NOT NULL CHECK (char_length(btrim(full_name)) BETWEEN 1 AND 160),
  brand_name text,
  product_name text,
  consultation_topic text,
  domicile text,
  age smallint,
  whatsapp_url text NOT NULL CHECK (char_length(whatsapp_url) <= 2048 AND whatsapp_url ~ '^https://'),
  catalog_url text NOT NULL CHECK (char_length(catalog_url) <= 2048 AND catalog_url ~ '^https?://'),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT visitor_form_fields_match_type CHECK (
    (
      visitor_type = 'booth'
      AND brand_name IS NOT NULL AND char_length(btrim(brand_name)) BETWEEN 1 AND 160
      AND product_name IS NOT NULL AND char_length(btrim(product_name)) BETWEEN 1 AND 500
      AND consultation_topic IS NOT NULL AND consultation_topic IN (
        'Sertifikat Halal', 'Sertifikat Uji Mutu', 'SNI', 'Desain Kemasan',
        'Desain Fashion', 'Pelatihan', 'Pameran', 'Surat keterangan Asal (SKA)'
      )
      AND domicile IS NULL AND age IS NULL
    )
    OR (
      visitor_type = 'umum'
      AND domicile IS NOT NULL AND char_length(btrim(domicile)) BETWEEN 1 AND 300
      AND age IS NOT NULL AND age BETWEEN 0 AND 120
      AND brand_name IS NULL AND product_name IS NULL AND consultation_topic IS NULL
    )
  )
);

CREATE INDEX IF NOT EXISTS visitor_form_submissions_type_created_idx
  ON public.visitor_form_submissions (visitor_type, created_at DESC, id DESC);

ALTER TABLE public.visitor_form_submissions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.visitor_form_submissions FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.visitor_form_submissions TO authenticated;
GRANT ALL ON public.visitor_form_submissions TO service_role;

DROP POLICY IF EXISTS visitor_forms_admin_read ON public.visitor_form_submissions;
CREATE POLICY visitor_forms_admin_read ON public.visitor_form_submissions
  FOR SELECT TO authenticated
  USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'pride_role' = 'organizer_admin');

COMMIT;
