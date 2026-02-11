package com.handshaker.company_service.events;

import java.time.Instant;
import java.util.UUID;

public class UserNotificationEvent {

    private UUID companyId;
    private UUID userId;
    private String message;
    private Instant createdAt;

    public UserNotificationEvent(UUID companyId, UUID userId, String message) {
        this.companyId = companyId;
        this.userId = userId;
        this.message = message;
        this.createdAt = Instant.now();
    }

    public UserNotificationEvent() {}

    public UUID getCompanyId() {
        return companyId;
    }

    public void setCompanyId(UUID companyId) {
        this.companyId = companyId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
