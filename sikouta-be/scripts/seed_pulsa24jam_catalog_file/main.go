package main

import (
	"context"
	"database/sql"
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"

	"sikouta/internal/repository"
)

func main() {
	log.SetFlags(0)
	_ = godotenv.Load(".env")

	dsn := strings.TrimSpace(os.Getenv("DATABASE_URL"))
	if dsn == "" {
		log.Fatal("DATABASE_URL is empty")
	}

	path := "data/pulsa24jam_h2hr_catalog.tsv"
	if len(os.Args) > 1 && strings.TrimSpace(os.Args[1]) != "" {
		path = strings.TrimSpace(os.Args[1])
	}

	items, err := readCatalog(path)
	if err != nil {
		log.Fatal(err)
	}

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("open database: %v", err)
	}
	defer db.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 4*time.Minute)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		log.Fatalf("ping database: %v", err)
	}

	result, err := repository.NewPulsa24JamCatalogRepository(db).Sync(ctx, items)
	if err != nil {
		log.Fatalf("seed katalog Pulsa24Jam gagal: %v", err)
	}
	fmt.Printf("Seeded Pulsa24Jam catalog from %s: %d produk\n", path, result.Synced)
}

func readCatalog(path string) ([]repository.Pulsa24JamCatalogItem, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("read catalog %s: %w", path, err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.Comma = '\t'
	reader.FieldsPerRecord = -1
	reader.ReuseRecord = true

	header, err := reader.Read()
	if err != nil {
		return nil, fmt.Errorf("read catalog header: %w", err)
	}
	if len(header) < 7 || header[0] != "category" || header[1] != "brand" || header[2] != "sku" {
		return nil, fmt.Errorf("format katalog tidak valid")
	}

	items := make([]repository.Pulsa24JamCatalogItem, 0, 16000)
	for {
		row, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("read catalog row: %w", err)
		}
		if len(row) < 7 {
			return nil, fmt.Errorf("baris katalog tidak lengkap: %v", row)
		}
		price, err := strconv.ParseInt(strings.TrimSpace(row[6]), 10, 64)
		if err != nil {
			return nil, fmt.Errorf("harga katalog tidak valid sku=%s: %w", row[2], err)
		}
		items = append(items, repository.Pulsa24JamCatalogItem{
			CategoryName: strings.TrimSpace(row[0]),
			BrandName:    strings.TrimSpace(row[1]),
			SKU:          strings.TrimSpace(row[2]),
			Name:         strings.TrimSpace(row[3]),
			GroupName:    strings.TrimSpace(row[4]),
			PriceType:    strings.TrimSpace(row[5]),
			Price:        price,
		})
	}
	if len(items) == 0 {
		return nil, fmt.Errorf("katalog kosong")
	}
	return items, nil
}
