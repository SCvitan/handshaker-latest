package com.handshaker.company_service.dto;

import com.handshaker.company_service.enums.SubscriptionPlan;

import java.time.LocalDate;

public class SubscriptionResponse {

    private SubscriptionPlan plan;

    private Integer aiSearchRemaining;

    private Integer contactTokensRemaining;

    private LocalDate subscriptionEndDate;

    private boolean active;

    public SubscriptionPlan getPlan() {
        return plan;
    }

    public void setPlan(SubscriptionPlan plan) {
        this.plan = plan;
    }

    public Integer getAiSearchRemaining() {
        return aiSearchRemaining;
    }

    public void setAiSearchRemaining(Integer aiSearchRemaining) {
        this.aiSearchRemaining = aiSearchRemaining;
    }

    public Integer getContactTokensRemaining() {
        return contactTokensRemaining;
    }

    public void setContactTokensRemaining(Integer contactTokensRemaining) {
        this.contactTokensRemaining = contactTokensRemaining;
    }

    public LocalDate getSubscriptionEndDate() {
        return subscriptionEndDate;
    }

    public void setSubscriptionEndDate(LocalDate subscriptionEndDate) {
        this.subscriptionEndDate = subscriptionEndDate;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}



