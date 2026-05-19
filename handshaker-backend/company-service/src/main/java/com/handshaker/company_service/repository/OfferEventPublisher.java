package com.handshaker.company_service.repository;

import com.handshaker.company_service.dto.OfferSentEvent;

public interface OfferEventPublisher {
    void publishOfferSent(OfferSentEvent event);
}
