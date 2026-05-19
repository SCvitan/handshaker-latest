package com.handshaker.company_service.dto;

import java.util.UUID;

public class SendOfferRequest {

    private UUID jobAdId;
    private UUID workerId;

    public UUID getJobAdId() {
        return jobAdId;
    }

    public void setJobAdId(UUID jobAdId) {
        this.jobAdId = jobAdId;
    }

    public UUID getWorkerId() {
        return workerId;
    }

    public void setWorkerId(UUID workerId) {
        this.workerId = workerId;
    }
}