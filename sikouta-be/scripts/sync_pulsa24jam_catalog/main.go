package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"

	"sikouta/config"
	"sikouta/internal/provider"
	"sikouta/internal/repository"
	"sikouta/internal/service"
)

func main() {
	cfg := config.Load()
	db, err := sql.Open("postgres", cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("db open error: %v", err)
	}
	defer db.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 4*time.Minute)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		log.Fatalf("db ping error: %v", err)
	}

	client := provider.NewPulsa24JamAdapter(provider.Pulsa24JamConfig{
		BaseURL:       cfg.Pulsa24JamBaseURL,
		MemberID:      cfg.Pulsa24JamMemberID,
		APIKey:        cfg.Pulsa24JamAPIKey,
		PIN:           cfg.Pulsa24JamPIN,
		Password:      cfg.Pulsa24JamPassword,
		Secret:        cfg.Pulsa24JamSecret,
		CallbackToken: cfg.Pulsa24JamCallbackToken,
		Timeout:       cfg.Pulsa24JamTimeout,
	})
	if !client.Configured() {
		log.Fatal("Pulsa24Jam credential belum lengkap")
	}

	syncService := service.NewPulsa24JamCatalogSyncService(repository.NewPulsa24JamCatalogRepository(db), client)
	result, err := syncService.Sync(ctx)
	if err != nil {
		log.Fatalf("Pulsa24Jam product sync gagal: %v", err)
	}
	fmt.Printf("Pulsa24Jam product sync selesai: %d produk\n", result.Synced)
}
