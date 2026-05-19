package com.handshaker.company_service.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record CandidateProcessResponse(

        UUID processId,
        UUID workerId,

        String firstName,
        String lastName,

        String country,

        String position,
        String industry,

        String status,

        boolean hasWorkPermit,
        boolean inAnotherProcess,

        boolean contactUnlocked,

        Double salaryAmount,

        LocalDateTime sentAt,
        LocalDateTime viewedAt

) {}
