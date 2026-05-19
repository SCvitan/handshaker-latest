package com.handshaker.company_service.enums;

public enum SubscriptionPlan {

    BASIC(20, 5),
    PRO(50, 10),
    AGENCY(150, 30);

    private final int aiSearchCount;
    private final int tokenCount;

    SubscriptionPlan(int aiSearchCount, int tokenCount) {
        this.aiSearchCount = aiSearchCount;
        this.tokenCount = tokenCount;
    }

    public int getAiSearchCount() {
        return aiSearchCount;
    }

    public int getTokenCount() {
        return tokenCount;
    }
}
