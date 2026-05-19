package com.handshaker.company_service.dto;

import com.handshaker.company_service.enums.OfferStatus;

public class OfferResponseRequest {

    private OfferStatus status;

    public OfferStatus getStatus() {
        return status;
    }

    public void setStatus(OfferStatus status) {
        this.status = status;
    }
}
