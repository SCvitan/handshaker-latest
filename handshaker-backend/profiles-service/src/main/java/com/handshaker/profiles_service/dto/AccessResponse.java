package com.handshaker.profiles_service.dto;

public class AccessResponse {

    private boolean premium;

    private Integer aiSearchRemaining;

    private Integer contactTokensRemaining;

    public boolean isPremium() {
        return premium;
    }

    public void setPremium(boolean premium) {
        this.premium = premium;
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
}
