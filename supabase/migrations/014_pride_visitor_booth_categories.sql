-- Existing brands remain in All until an admin selects a category.
-- Rollback: deploy the previous app version; retain this optional column and its data.
BEGIN;

ALTER TABLE public.visitor_booths ADD COLUMN IF NOT EXISTS category text;

DO $migration$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.visitor_booths'::regclass
      AND conname = 'visitor_booths_category_check'
  ) THEN
    ALTER TABLE public.visitor_booths
      ADD CONSTRAINT visitor_booths_category_check
      CHECK (category IN ('Kuliner', 'Fesyen', 'Kriya'));
  END IF;
END
$migration$;

COMMIT;
