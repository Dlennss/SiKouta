package service

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"sikouta/internal/helper"
	"sikouta/internal/provider"
	"sikouta/internal/repository"
)

type appOrderPulsa24JamRequest struct {
	Product string
	Qty     int64
	Dest    string
	RefID   string
}

func (s *AppOrderService) refreshPulsa24JamOrderStatus(ctx context.Context, row *repository.AppOrderRow) {
	if s == nil || row == nil || row.Status != "processing_provider" || s.Pulsa24JamClient == nil || s.appProviderRepo == nil {
		return
	}
	if row.DiubahPada != nil && time.Since(*row.DiubahPada) < 10*time.Second {
		return
	}
	providerRow, err := s.appProviderRepo.GetLatestByAppOrderID(ctx, row.ID)
	if err != nil || providerRow == nil {
		return
	}
	if !strings.EqualFold(strings.TrimSpace(providerRow.Provider), provider.Pulsa24JamProviderName) {
		return
	}
	if strings.TrimSpace(strings.ToLower(providerRow.Status)) != "pending" {
		return
	}

	req := appOrderPulsa24JamRequestFromRows(row, providerRow)
	if req.Product == "" || req.Qty <= 0 || req.Dest == "" || req.RefID == "" {
		return
	}
	response, err := s.Pulsa24JamClient.Pay(ctx, provider.PayRequest{
		Command: "STATUS-PAY",
		Product: req.Product,
		Dest:    req.Dest,
		Qty:     req.Qty,
		RefID:   req.RefID,
	})
	if err != nil || response == nil || response.HTTPStatus < 200 || response.HTTPStatus >= 300 {
		return
	}

	rawRespJSON, _ := json.Marshal(map[string]any{
		"http_status":  response.HTTPStatus,
		"body":         response.Body,
		"message":      response.Message,
		"rc":           response.RC,
		"provider_ref": response.ProviderRef,
		"price":        response.Price,
		"balance":      response.Balance,
		"source":       "STATUS-PAY",
	})
	message := strings.TrimSpace(firstText(response.Message, response.Body))
	price := response.Price
	sn := strings.TrimSpace(firstText(response.ProviderRef, response.Message))

	finalStatus := appOrderPulsa24JamStatusPayFinalStatus(response.Body, response.Message, response.RC)
	if finalStatus == "success" {
		update := repository.AppOrderProviderTrxUpdateInput{
			ID:          providerRow.ID,
			Status:      "success",
			KodeRespon:  firstText(response.RC, "00"),
			Pesan:       message,
			SN:          sn,
			RawCallback: string(rawRespJSON),
		}
		if price > 0 {
			update.HargaProvider = &price
		}
		_ = s.appProviderRepo.UpdateResult(ctx, update)
		if price > 0 && s.callbackRepo != nil {
			appProviderID := providerRow.ID
			if _, _, walletErr := s.callbackRepo.ApplyProviderWalletTx(ctx, repository.CallbackProviderWalletTxIn{
				Provider:              provider.Pulsa24JamProviderName,
				RefID:                 req.RefID,
				Arah:                  "debit",
				Jumlah:                price,
				Alasan:                "APP_TRX_SUCCESS_COST",
				Catatan:               "auto debit by STATUS-PAY (app success)",
				AppOrderProviderTrxID: &appProviderID,
			}); walletErr != nil {
				helper.AppendProviderServiceLog("provider_wallet.log", "provider wallet debit app STATUS-PAY failed provider=Pulsa24Jam refid=%s app_provider_id=%d err=%v", req.RefID, providerRow.ID, walletErr)
			}
		}
		if s.orderRepo.UpdateStatusByID(ctx, row.ID, "success") == nil {
			row.Status = "success"
			if sn != "" {
				row.SN = &sn
			}
			if s.retailRepo != nil {
				if err := s.retailRepo.ApplyCommissionForOrder(ctx, row.ID); err != nil {
					helper.AppendProviderServiceLog("provider_wallet.log", "retail commission apply STATUS-PAY failed invoice=%s order_id=%d err=%v", row.InvoiceID, row.ID, err)
				}
			}
		}
		return
	}

	if finalStatus != "failed" {
		_ = s.appProviderRepo.UpdateResult(ctx, repository.AppOrderProviderTrxUpdateInput{
			ID:          providerRow.ID,
			Status:      "pending",
			KodeRespon:  response.RC,
			Pesan:       message,
			SN:          sn,
			RawCallback: string(rawRespJSON),
		})
		return
	}

	update := repository.AppOrderProviderTrxUpdateInput{
		ID:          providerRow.ID,
		Status:      "failed",
		KodeRespon:  response.RC,
		Pesan:       message,
		SN:          sn,
		RawCallback: string(rawRespJSON),
	}
	if price > 0 {
		update.HargaProvider = &price
	}
	_ = s.appProviderRepo.UpdateResult(ctx, update)

	if row.BuyerType == "user" && row.MemberID != nil && *row.MemberID > 0 && row.HargaFinal > 0 && s.callbackRepo != nil {
		reason := "refund saldo otomatis karena transaksi Pulsa24Jam gagal"
		if message != "" {
			reason = "refund saldo otomatis: " + message
		}
		if err := s.callbackRepo.RefundAppOrderFunding(ctx, *row.MemberID, row.InvoiceID, reason); err != nil {
			_ = s.orderRepo.UpdateStatusByID(ctx, row.ID, "failed")
			row.Status = "failed"
			helper.AppendProviderServiceLog("provider_callback_service.log", "Pulsa24Jam app STATUS-PAY refund failed refid=%s invoice=%s err=%v", req.RefID, row.InvoiceID, err)
			return
		}
		_ = s.orderRepo.UpdateStatusByID(ctx, row.ID, "refunded")
		row.Status = "refunded"
		return
	}
	if strings.EqualFold(strings.TrimSpace(row.BuyerType), "guest") && row.HargaFinal > 0 {
		_ = s.orderRepo.UpsertGuestRefundTicket(ctx, row, "refund guest pending claim: "+message)
	}
	_ = s.orderRepo.UpdateStatusByID(ctx, row.ID, "failed")
	row.Status = "failed"
}

func appOrderPulsa24JamRequestFromRows(order *repository.AppOrderRow, providerRow *repository.AppOrderProviderTrxRow) appOrderPulsa24JamRequest {
	out := appOrderPulsa24JamRequest{}
	if order != nil {
		out.Dest = strings.TrimSpace(order.Dest)
		out.Qty = order.Qty
	}
	if providerRow == nil {
		return out
	}
	out.RefID = strings.TrimSpace(providerRow.RefID)
	if providerRow.RawRequest != nil {
		var raw map[string]any
		if err := json.Unmarshal([]byte(*providerRow.RawRequest), &raw); err == nil {
			out.Product = strings.TrimSpace(fmt.Sprint(raw["product"]))
			if v := strings.TrimSpace(fmt.Sprint(raw["dest"])); v != "" && v != "<nil>" {
				out.Dest = v
			}
			if v := parsePulsa24JamInt(strings.TrimSpace(fmt.Sprint(raw["qty"]))); v > 0 {
				out.Qty = v
			}
			if v := strings.TrimSpace(fmt.Sprint(raw["refid"])); v != "" && v != "<nil>" {
				out.RefID = v
			}
		}
	}
	return out
}

func appOrderPulsa24JamStatusPayFinalStatus(values ...string) string {
	joined := strings.TrimSpace(strings.Join(values, " "))
	for _, value := range values {
		if status, ok := appOrderPulsa24JamStatusFromJSON(value); ok {
			switch status {
			case "2", "success", "sukses":
				return "success"
			case "3", "failed", "gagal":
				return "failed"
			case "1", "0", "pending", "diproses", "processing":
				return "pending"
			}
		}
	}
	upper := strings.ToUpper(joined)
	if strings.Contains(upper, `"RC":"00"`) ||
		strings.Contains(upper, "SUKSES") ||
		strings.Contains(upper, "SUCCESS") {
		return "success"
	}
	if strings.Contains(upper, `"STATUS":3`) ||
		strings.Contains(upper, `"STATUS":"3"`) ||
		strings.Contains(upper, "GAGAL") ||
		strings.Contains(upper, "FAILED") ||
		strings.Contains(upper, "DITOLAK") ||
		strings.Contains(upper, `"OK":FALSE`) ||
		strings.Contains(upper, `"SUCCESS":FALSE`) {
		return "failed"
	}
	return "pending"
}

func appOrderPulsa24JamStatusFromJSON(raw string) (string, bool) {
	raw = strings.TrimSpace(raw)
	if raw == "" || !strings.HasPrefix(raw, "{") {
		return "", false
	}
	var payload map[string]any
	if err := json.Unmarshal([]byte(raw), &payload); err != nil {
		return "", false
	}
	if status := appOrderPulsa24JamValueStatus(payload["status"]); status != "" {
		return status, true
	}
	for _, key := range []string{"transaksi_member", "data", "result"} {
		if nested, ok := payload[key].(map[string]any); ok {
			if status := appOrderPulsa24JamValueStatus(nested["status"]); status != "" {
				return status, true
			}
		}
	}
	return "", false
}

func appOrderPulsa24JamValueStatus(value any) string {
	switch v := value.(type) {
	case string:
		return strings.ToLower(strings.TrimSpace(v))
	case float64:
		return fmt.Sprintf("%.0f", v)
	case int:
		return fmt.Sprintf("%d", v)
	case int64:
		return fmt.Sprintf("%d", v)
	default:
		return ""
	}
}
