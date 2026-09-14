# SiKouta

Salinan mandiri aplikasi SiKouta dengan identitas Sikouta dan tema biru-cyan.
Frontend, backend, serta aset disalin dari versi sumber `2956380`.
Proyek sumber tidak diubah.

## Struktur

- `sikouta-fe`: frontend Next.js, logo dan banner SiKouta.
- `sikouta-be`: backend Go, integrasi provider, dan migrasi database.
- `.github/workflows`: template deployment manual, tanpa pemicu push otomatis.

## Pratinjau lokal

```powershell
cd sikouta-fe
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3011
```

Buka http://localhost:3011. File `sikouta-fe/.env.local` dibuat khusus
untuk pratinjau, dengan secret sesi baru dan backend di port 8091.

Frontend dapat menampilkan beranda, layanan, serta halaman login tanpa
backend. Login, saldo, katalog server, dan transaksi memerlukan backend
serta database SiKouta yang sudah dikonfigurasi. Tidak ada akun admin,
saldo, database, atau kredensial produksi yang disalin.

## Backend dan produksi

1. Buat database PostgreSQL baru khusus SiKouta.
2. Gunakan `sikouta-be/.env.example` sebagai acuan `.env`.
3. Isi `DATABASE_URL`, `JWT_SECRET`, dan konfigurasi provider dengan
   nilai baru. Port backend untuk pengembangan adalah 8091.
4. Siapkan skema dari folder `sql` dan migrasi yang diperlukan, lalu
   jalankan `go run .` dari folder backend.
5. Isi rekening, callback, OAuth, dan API key khusus SiKouta sebelum
   mengaktifkan transaksi.
6. Konfigurasikan domain dan layanan deployment terpisah. Jangan gunakan
   database atau service produksi proyek sumber.

Tidak ada remote GitHub atau koneksi deployment aktif. Workflow hanya
dapat dijalankan secara manual setelah secrets dan path server diperiksa.

## Identitas dan konfigurasi

- Logo aktif: `sikouta-fe/public/brand/logo.svg`.
- Ikon merek: `sikouta-fe/public/brand/mark.svg`.
- Cookie login terpisah: `sikouta_auth_token` dan `sikouta.*`.
- `NEXT_PUBLIC_SUPPORT_WHATSAPP`: nomor bantuan milik SiKouta.
  Jika kosong, kontak WhatsApp dan live chat sumber tidak digunakan.
- `NEXT_PUBLIC_SITE_URL` / `NEXTAUTH_URL`: URL aplikasi SiKouta.
- Google OAuth dan analitik sumber dinonaktifkan.
- Aset referensi warisan tetap tersimpan, tetapi logo, hero, dan banner
  bawaan yang ditampilkan sudah menggunakan identitas SiKouta.

Folder dependensi, hasil build, dan file environment rahasia tidak boleh
dimasukkan ke Git.
