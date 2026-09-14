package router

import (
	"database/sql"
	"net/http"

	"sikouta/db"
	"sikouta/internal/controller"
	"sikouta/internal/helper"
	"sikouta/internal/repository"
	"sikouta/internal/service"
	"sikouta/javapay"
)

type JavapayInternalDeps struct {
	DB       *sql.DB
	JPClient *javapay.Client
}

func JavapayInternalRouter(mux *http.ServeMux, deps JavapayInternalDeps) {
	dbRepo := db.NewJavapayRepo(deps.DB)
	repo := repository.NewJavapayInternalRepository(dbRepo)
	svc := service.NewJavapayInternalService(repo, deps.JPClient)
	ctrl := controller.NewJavapayInternalController(svc)

	mux.HandleFunc("/internal/javapay/trx", helper.RequireInternalSecret(ctrl.HandleTrx))
	mux.HandleFunc("/internal/javapay/produk", helper.RequireInternalSecret(ctrl.HandleProduk))
}
