BEGIN;

ALTER TABLE public.visitor_form_submissions
  ALTER COLUMN whatsapp_url DROP NOT NULL,
  ALTER COLUMN catalog_url DROP NOT NULL;

COMMIT;
