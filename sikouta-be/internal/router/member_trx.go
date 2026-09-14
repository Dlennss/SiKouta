package router

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"time"

	"sikouta/ajs"
	"sikouta/chytron"
	"sikouta/gemilang"
	"sikouta/internal/controller"
	"sikouta/internal/provider"
	"sikouta/internal/repository"
	"sikouta/internal/service"
	"sikouta/javapay"
	"sikouta/loketbayar"
	"sikouta/minions"
	"sikouta/multikom"
	"sikouta/rajabiller"
	"sikouta/sagaramobile"
	"sikouta/smb"
	"sikouta/talenta"
	"sikouta/trionik"
	"sikouta/yuscom"
)

type MemberTrxDeps struct {
	DB           *sql.DB
	YSClient     *yuscom.Client
	JPClient     *javapay.Client
	TLClient     *talenta.Client
	MKClient     *multikom.Client
	SGClient     *sagaramobile.Client
	MNClient     *minions.Client
	TRClient     *trionik.Client
	AJClient     *ajs.Client
	GMClient     *gemilang.Client
	SMClient     *smb.Client
	LBClient     *loketbayar.Client
	CHClient     *chytron.Client
	RJClient     *rajabiller.Client
	ExtraClients []provider.Client
}

func MemberTrxRouter(mux *http.ServeMux, deps MemberTrxDeps) {
	repo := repository.NewMemberTrxRepository(deps.DB)
	svc := service.NewMemberTrxService(repo, deps.YSClient, deps.JPClient, deps.TLClient, deps.MKClient, deps.SGClient, deps.MNClient, deps.TRClient, deps.AJClient, deps.GMClient, deps.SMClient, deps.LBClient, deps.CHClient, deps.RJClient, deps.ExtraClients...)
	ctrl := controller.NewMemberTrxController(svc)

	mux.HandleFunc("/v1/trx", ctrl.Handle)

	go func() {
		ticker := time.NewTicker(1 * time.Minute)
		defer ticker.Stop()
		for range ticker.C {
			ctx, cancel := context.WithTimeout(context.Background(), 55*time.Second)
			n := svc.RetryPendingTransactions(ctx)
			cancel()
			if n > 0 {
				log.Printf("[retry_pending] %d transaksi di-retry", n)
			}
		}
	}()

	go func() {
		ticker := time.NewTicker(30 * time.Second)
		defer ticker.Stop()
		for range ticker.C {
			ctx, cancel := context.WithTimeout(context.Background(), 55*time.Second)
			n := svc.RetryPendingCallbackWaitProviders(ctx)
			cancel()
			if n > 0 {
				log.Printf("[retry_pending_callback_wait] %d transaksi di-retry", n)
			}
		}
	}()
}
