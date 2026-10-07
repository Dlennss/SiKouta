package service

import (
	"strings"
	"testing"

	"sikouta/internal/repository"
)

func TestAppOrderProviderImmediateRejectPulsa24Jam(t *testing.T) {
	tests := []struct {
		name string
		body string
		want bool
	}{
		{
			name: "insufficient provider balance",
			body: `{"message":"saldo tidak cukup","ok":true,"refid":"INV-1","status":3}`,
			want: true,
		},
		{
			name: "numeric rejected status",
			body: `{"message":"produk tidak ditemukan","ok":true,"refid":"INV-2","status":3}`,
			want: true,
		},
		{
			name: "pending accepted",
			body: `{"message":"Transaksi sedang diproses","ok":true,"refid":"INV-3","status":"pending"}`,
			want: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := appOrderProviderImmediateReject("Pulsa24Jam", tt.body); got != tt.want {
				t.Fatalf("appOrderProviderImmediateReject() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestAppOrderProviderRefIDPulsa24Jam(t *testing.T) {
	order := &repository.AppOrderRow{ID: 2, InvoiceID: "INV-20261007142842-A9B4DF0D"}
	got := appOrderProviderRefID("pulsa24jam", order)
	if got != "SIA207142842A9B4DF0D" {
		t.Fatalf("refid = %q, want %q", got, "SIA207142842A9B4DF0D")
	}
	if len(got) > 20 {
		t.Fatalf("refid too long: %q len=%d", got, len(got))
	}
	for _, r := range got {
		if !strings.ContainsRune("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", r) {
			t.Fatalf("refid contains non alnum uppercase rune %q in %q", r, got)
		}
	}
}

func TestAppOrderProviderProductUnavailable(t *testing.T) {
	if !appOrderProviderProductUnavailable("Pulsa24Jam", `{"message":"Produk kehabisan stok","status":3}`) {
		t.Fatal("out-of-stock response should quarantine the product")
	}
	if appOrderProviderProductUnavailable("Pulsa24Jam", `{"message":"Nomor tujuan salah","status":3}`) {
		t.Fatal("business rejection unrelated to stock must not quarantine the product")
	}
	if appOrderProviderProductUnavailable("yuscom", `{"message":"Produk kehabisan stok","status":3}`) {
		t.Fatal("only Pulsa24Jam products should be quarantined")
	}
}

func TestAppOrderPulsa24JamStatusPayFinalStatus(t *testing.T) {
	tests := []struct {
		name string
		body string
		want string
	}{
		{
			name: "nested provider pending is not success",
			body: `{"ok":true,"transaksi_member":{"status":1,"keterangan":"Sedang diproses"}}`,
			want: "pending",
		},
		{
			name: "nested provider success",
			body: `{"ok":true,"transaksi_member":{"status":2,"keterangan":"Sukses","sn":"ABC123"}}`,
			want: "success",
		},
		{
			name: "nested provider failed",
			body: `{"ok":true,"transaksi_member":{"status":3,"keterangan":"Gagal"}}`,
			want: "failed",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := appOrderPulsa24JamStatusPayFinalStatus(tt.body); got != tt.want {
				t.Fatalf("status = %q, want %q", got, tt.want)
			}
		})
	}
}

func TestAppOrderPulsa24JamNestedValues(t *testing.T) {
	body := `{"ok":true,"transaksi_member":{"biaya_perkiraan":101200,"status":2,"sn":"SN123"}}`
	if got := appOrderPulsa24JamNestedInt(body, "biaya_perkiraan"); got != 101200 {
		t.Fatalf("nested price = %d, want 101200", got)
	}
	if got := appOrderPulsa24JamNestedText(body, "sn"); got != "SN123" {
		t.Fatalf("nested sn = %q, want SN123", got)
	}
}

func TestAppOrderPulsa24JamRequestFromRows(t *testing.T) {
	raw := `{"product":"GOPAY","qty":100000,"dest":"085771187308","refid":"SIA1"}`
	row := repository.AppOrderRow{Dest: "0857", Qty: 1}
	providerRow := repository.AppOrderProviderTrxRow{RefID: "SIA0", RawRequest: &raw}
	got := appOrderPulsa24JamRequestFromRows(&row, &providerRow)
	if got.Product != "GOPAY" || got.Qty != 100000 || got.Dest != "085771187308" || got.RefID != "SIA1" {
		t.Fatalf("request = %+v", got)
	}
}

func TestResolvePulsa24JamAppRequest(t *testing.T) {
	tests := []struct {
		name        string
		order       repository.AppOrderRow
		wantProduct string
		wantQty     int64
	}{
		{
			name:        "fixed dana uses open amount route",
			order:       repository.AppOrderRow{ProdukSKUSnapshot: "UDDND10", ProdukNamaSnapshot: "Dana 10.000", Qty: 1, HargaDasar: 11055},
			wantProduct: "DANA", wantQty: 10000,
		},
		{
			name:        "fixed gopay uses open amount route",
			order:       repository.AppOrderRow{ProdukSKUSnapshot: "UDGP10", ProdukNamaSnapshot: "Gopay 10.000", Qty: 1, HargaDasar: 11650},
			wantProduct: "GOPAY", wantQty: 10000,
		},
		{
			name:        "gopay driver keeps dedicated route",
			order:       repository.AppOrderRow{ProdukSKUSnapshot: "UDGD15", ProdukNamaSnapshot: "Gopay Driver 15.000", Qty: 1, HargaDasar: 16450},
			wantProduct: "UDGD15", wantQty: 1,
		},
		{
			name:        "open amount remains unchanged",
			order:       repository.AppOrderRow{ProdukSKUSnapshot: "DANA", ProdukNamaSnapshot: "Dana Bebas Nominal", Qty: 25000, HargaDasar: 26000},
			wantProduct: "DANA", wantQty: 25000,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			product, qty := resolvePulsa24JamAppRequest(tt.order.ProdukSKUSnapshot, &tt.order)
			if product != tt.wantProduct || qty != tt.wantQty {
				t.Fatalf("got product=%s qty=%d, want product=%s qty=%d", product, qty, tt.wantProduct, tt.wantQty)
			}
		})
	}
}
