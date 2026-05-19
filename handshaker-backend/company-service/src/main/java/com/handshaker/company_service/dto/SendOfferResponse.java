package com.handshaker.company_service.dto;

import java.util.UUID;

public class SendOfferResponse {
    private UUID offerId;

    public SendOfferResponse(UUID offerId) {
        this.offerId = offerId;
    }

    public UUID getOfferId() {
        return offerId;
    }

    public void setOfferId(UUID offerId) {
        this.offerId = offerId;
    }
}
