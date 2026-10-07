BEGIN;

CREATE TABLE IF NOT EXISTS public.app_runtime_flag (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.app_runtime_flag (key, value, updated_at)
VALUES ('product_catalog_cleared', 'false', now())
ON CONFLICT (key) DO UPDATE SET
  value = 'false',
  updated_at = now();

COMMIT;
