BEGIN;

WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY kategori_id
           ORDER BY aktif DESC, updated_at DESC NULLS LAST, id DESC
         ) AS rn
  FROM public.kategori_fee_app
)
DELETE FROM public.kategori_fee_app kfa
USING ranked r
WHERE kfa.id = r.id
  AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS kategori_fee_app_kategori_id_unique_idx
  ON public.kategori_fee_app (kategori_id);

WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY produk_id
           ORDER BY aktif DESC, updated_at DESC NULLS LAST, id DESC
         ) AS rn
  FROM public.produk_app_pricing
)
DELETE FROM public.produk_app_pricing app
USING ranked r
WHERE app.id = r.id
  AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS produk_app_pricing_produk_id_unique_idx
  ON public.produk_app_pricing (produk_id);

WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY produk_id, provider, kode_provider
           ORDER BY aktif DESC, diubah_pada DESC NULLS LAST, id DESC
         ) AS rn
  FROM public.produk_provider_map
)
DELETE FROM public.produk_provider_map ppm
USING ranked r
WHERE ppm.id = r.id
  AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS produk_provider_map_produk_provider_kode_unique_idx
  ON public.produk_provider_map (produk_id, provider, kode_provider);

COMMIT;
