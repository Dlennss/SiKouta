ALTER TABLE public.produk_provider_map
  ADD COLUMN IF NOT EXISTS special_code TEXT,
  ADD COLUMN IF NOT EXISTS jam_buka TIME NULL,
  ADD COLUMN IF NOT EXISTS jam_tutup TIME NULL;
