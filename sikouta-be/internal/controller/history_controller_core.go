package controller

import "sikouta/internal/service"

type HistoryController struct {
	svc *service.HistoryService
}

func NewHistoryController(svc *service.HistoryService) *HistoryController {
	return &HistoryController{svc: svc}
}
