BEGIN;

UPDATE public.kategori_fee_app kfa
SET aktif = true,
    updated_at = now()
WHERE EXISTS (
  SELECT 1
  FROM public.produk p
  JOIN public.produk_app_pricing app
    ON app.produk_id = p.id
   AND app.aktif = true
   AND LOWER(TRIM(app.provider)) = 'pulsa24jam'
  WHERE p.kategori_id = kfa.kategori_id
    AND p.aktif = true
);

COMMIT;
