package com.handshaker.company_service.service;

import com.handshaker.company_service.dto.CompanyDashboardResponse;

import java.util.UUID;

public interface DashboardService {
    CompanyDashboardResponse getDashboard(UUID companyId);
}
