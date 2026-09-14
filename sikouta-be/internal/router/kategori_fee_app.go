package router

import (
	"database/sql"
	"net/http"

	"sikouta/internal/controller"
	"sikouta/internal/repository"
	"sikouta/internal/service"
)

func KategoriFeeAppRouter(mux *http.ServeMux, wrap Middleware, requireAdmin Middleware, db *sql.DB) {
	repo := repository.NewKategoriFeeAppRepository(db)
	svc := service.NewKategoriFeeAppService(repo)
	ctrl := controller.NewKategoriFeeAppController(svc, "/v1/admin")

	mux.HandleFunc("/v1/admin/kategori-fee-app", wrap(requireAdmin(ctrl.Handle)))
	mux.HandleFunc("/v1/admin/kategori-fee-app/", wrap(requireAdmin(ctrl.Handle)))
}
