package com.handshaker.company_service.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record OfferSentEvent(
        UUID offerId,
        UUID companyId,
        UUID workerId,
        String position,
        String industry,
        LocalDateTime sentAt
) {}
