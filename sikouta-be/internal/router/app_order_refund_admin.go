package router

import (
	"database/sql"
	"net/http"

	"sikouta/internal/controller"
	"sikouta/internal/helper"
	"sikouta/internal/repository"
	"sikouta/internal/service"
)

func AppOrderRefundAdminRouter(mux *http.ServeMux, wrap Middleware, db *sql.DB) {
	orderRepo := repository.NewAppOrderRepository(db)
	authRepo := repository.NewAuthRepository(db)
	svc := service.NewAppOrderRefundAdminService(orderRepo, authRepo)
	ctrl := controller.NewAppOrderRefundAdminController(svc)

	mux.HandleFunc("/v1/admin/app/guest-refunds", wrap(helper.RequireRoles("admin", "operator_trx", "operator_wallet")(ctrl.HandleList)))
	mux.HandleFunc("/v1/admin/app/guest-refunds/claim", wrap(helper.RequireRoles("admin", "operator_trx", "operator_wallet")(ctrl.HandleClaim)))
}
