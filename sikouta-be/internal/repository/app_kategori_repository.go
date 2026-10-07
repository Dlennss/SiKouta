package repository

import (
	"context"
	"database/sql"
)

type AppKategoriRepository struct {
	db *sql.DB
}

func NewAppKategoriRepository(db *sql.DB) *AppKategoriRepository {
	return &AppKategoriRepository{db: db}
}

func (r *AppKategoriRepository) List(ctx context.Context) ([]MasterSimpleRow, error) {
	rows, err := r.db.QueryContext(ctx, `
SELECT DISTINCT
  k.id,
  k.nama,
  k.aktif,
  k.dibuat_pada,
  k.diubah_pada
FROM public.kategori k
JOIN public.produk p
  ON p.kategori_id = k.id
 AND p.aktif = true
JOIN public.brand b
  ON b.id = p.brand_id
 AND b.aktif = true
JOIN LATERAL (
  SELECT a.id
  FROM public.produk_app_pricing a
  WHERE a.produk_id = p.id
    AND a.aktif = true
    AND LOWER(TRIM(a.provider)) = 'pulsa24jam'
  ORDER BY
    a.harga ASC,
    a.id DESC
  LIMIT 1
) app ON true
JOIN public.kategori_fee_app kfa
  ON kfa.kategori_id = p.kategori_id
 AND kfa.aktif = true
WHERE k.aktif = true
ORDER BY k.id ASC
`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]MasterSimpleRow, 0, 64)
	for rows.Next() {
		var row MasterSimpleRow
		if err := rows.Scan(&row.ID, &row.Nama, &row.Aktif, &row.DibuatPada, &row.DiubahPada); err != nil {
			return nil, err
		}
		out = append(out, row)
	}
	return out, rows.Err()
}
