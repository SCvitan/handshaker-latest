package com.handshaker.company_service.dto;

public record DashboardStatsResponse(

        int totalCandidates,
        int awaitingResponse,
        int interested,
        int contactUnlocked,
        int rejected

) {}
