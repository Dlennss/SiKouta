package router

import (
	"database/sql"
	"net/http"

	"sikouta/internal/controller"
	"sikouta/internal/provider"
	"sikouta/internal/repository"
	"sikouta/internal/service"
)

func AppOrderMeRouter(mux *http.ServeMux, db *sql.DB, jwtSecret []byte, extraClients ...provider.Client) {
	var p24Adapter *provider.Pulsa24JamAdapter
	for _, client := range extraClients {
		if client != nil && client.Name() == provider.Pulsa24JamProviderName {
			p24Adapter, _ = client.(*provider.Pulsa24JamAdapter)
			break
		}
	}
	orderRepo := repository.NewAppOrderRepository(db)
	produkRepo := repository.NewProdukRepository(db)
	pricingRepo := repository.NewProdukAppPricingRepository(db)
	feeRepo := repository.NewKategoriFeeAppRepository(db)
	paymentRepo := repository.NewAppOrderPaymentRepository(db)
	appProviderRepo := repository.NewAppOrderProviderTrxRepository(db)
	billingCheckRepo := repository.NewAppBillingCheckRepository(db)
	callbackRepo := repository.NewProviderCallbackRepository(db)
	retailRepo := repository.NewRetailRepository(db)
	svc := service.NewAppOrderService(orderRepo, paymentRepo, produkRepo, pricingRepo, feeRepo, appProviderRepo, billingCheckRepo)
	svc.SetPulsa24JamClient(p24Adapter)
	svc.SetSettlementRepos(callbackRepo, retailRepo)
	ctrl := controller.NewAppOrderMeController(svc, jwtSecret)

	mux.HandleFunc("/v1/app/me/orders", ctrl.Handle)
}
