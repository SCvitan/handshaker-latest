package com.handshaker.company_service.dto;

import java.util.List;

public record CompanyDashboardResponse(

        Integer tokensRemaining,

        DashboardStatsResponse stats,

        List<CandidateProcessResponse> candidates

) {}
