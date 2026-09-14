package router

import (
	"database/sql"
	"net/http"

	"sikouta/internal/controller"
	"sikouta/internal/repository"
	"sikouta/internal/service"
)

func AppOrderRefundMeRouter(mux *http.ServeMux, db *sql.DB, jwtSecret []byte) {
	orderRepo := repository.NewAppOrderRepository(db)
	svc := service.NewAppOrderRefundService(orderRepo)
	ctrl := controller.NewAppOrderRefundMeController(svc, jwtSecret)

	mux.HandleFunc("/v1/app/me/refunds/claim", ctrl.HandleClaim)
}
