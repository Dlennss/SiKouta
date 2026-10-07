package service

import (
	"context"
	"fmt"
	"strings"

	"sikouta/internal/helper"
	"sikouta/internal/repository"
)

func (s *AppOrderService) GetByInvoiceID(ctx context.Context, invoiceID string) (*repository.AppOrderRow, error) {
	invoiceID = strings.TrimSpace(invoiceID)
	if invoiceID == "" {
		return nil, fmt.Errorf("invoice_id wajib diisi")
	}
	row, err := s.orderRepo.GetByInvoiceID(ctx, invoiceID)
	if err != nil {
		return nil, err
	}
	s.refreshPulsa24JamOrderStatus(ctx, row)
	if row.Status != "processing_provider" {
		if refreshed, refreshErr := s.orderRepo.GetByInvoiceID(ctx, invoiceID); refreshErr == nil && refreshed != nil {
			row = refreshed
		}
	}
	s.attachBillingInquiry(ctx, row)
	return row, nil
}

func (s *AppOrderService) ListByMemberID(ctx context.Context, f repository.AppOrderListFilter) ([]repository.AppOrderRow, error) {
	if f.MemberID <= 0 {
		return nil, fmt.Errorf("user tidak valid")
	}
	f.Status = strings.TrimSpace(strings.ToLower(f.Status))
	if f.Status != "" {
		switch f.Status {
		case "pending_payment", "paid", "processing_provider", "success", "failed", "refunded", "expired", "cancelled":
		default:
			return nil, fmt.Errorf("status tidak valid")
		}
	}
	if f.Limit <= 0 {
		f.Limit = 20
	}
	if f.Limit > 100 {
		f.Limit = 100
	}
	if f.Offset < 0 {
		f.Offset = 0
	}
	rows, err := s.orderRepo.ListByMemberID(ctx, f)
	if err != nil {
		return nil, err
	}
	return s.refreshPulsa24JamOrderStatuses(ctx, rows), nil
}

func (s *AppOrderService) List(ctx context.Context, f repository.AppOrderListFilter) ([]repository.AppOrderRow, error) {
	f.Status = strings.TrimSpace(strings.ToLower(f.Status))
	if f.Status != "" {
		switch f.Status {
		case "pending_payment", "paid", "processing_provider", "success", "failed", "refunded", "expired", "cancelled":
		default:
			return nil, fmt.Errorf("status tidak valid")
		}
	}
	f.BuyerType = strings.TrimSpace(strings.ToLower(f.BuyerType))
	if f.BuyerType != "" {
		switch f.BuyerType {
		case "user", "guest":
		default:
			return nil, fmt.Errorf("buyer_type tidak valid")
		}
	}
	if f.Limit <= 0 {
		f.Limit = 20
	}
	if f.Limit > 100 {
		f.Limit = 100
	}
	if f.Offset < 0 {
		f.Offset = 0
	}
	rows, err := s.orderRepo.List(ctx, f)
	if err != nil {
		return nil, err
	}
	return s.refreshPulsa24JamOrderStatuses(ctx, rows), nil
}

func (s *AppOrderService) refreshPulsa24JamOrderStatuses(ctx context.Context, rows []repository.AppOrderRow) []repository.AppOrderRow {
	for index := range rows {
		s.refreshPulsa24JamOrderStatus(ctx, &rows[index])
	}
	return rows
}
func (s *AppOrderService) attachBillingInquiry(ctx context.Context, row *repository.AppOrderRow) {
	if row == nil || s.appProviderRepo == nil {
		return
	}
	providerRow, err := s.appProviderRepo.GetLatestByAppOrderID(ctx, row.ID)
	if err != nil || providerRow == nil {
		return
	}
	parsed := helper.ParseAppBillingInquiry(providerRow.Provider, providerRow.Status, valueOrEmptyString(providerRow.Pesan))
	if parsed == nil {
		return
	}
	row.BillingInquiry = mapBillingInquiry(parsed)
}
