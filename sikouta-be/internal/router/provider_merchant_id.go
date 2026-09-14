package router

import (
	"database/sql"
	"net/http"

	"sikouta/internal/controller"
	"sikouta/internal/helper"
	"sikouta/internal/repository"
	"sikouta/internal/service"
)

func ProviderMerchantIDRouter(mux *http.ServeMux, wrap Middleware, db *sql.DB) {
	repo := repository.NewProviderMerchantIDRepository(db)
	svc := service.NewProviderMerchantIDService(repo)
	ctrl := controller.NewProviderMerchantIDController(svc)
	roles := helper.RequireRoles("admin")

	mux.HandleFunc("/v1/admin/provider-merchant-ids", wrap(roles(ctrl.Handle)))
	mux.HandleFunc("/v1/admin/provider-merchant-ids/", wrap(roles(ctrl.Handle)))
}
