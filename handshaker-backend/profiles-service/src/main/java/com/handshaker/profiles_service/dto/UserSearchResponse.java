package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.enums.ExperienceLevel;

import java.math.BigDecimal;
import java.util.UUID;

public record UserSearchResponse(
        UUID userId,
        String firstName,
        String lastName,
        String desiredIndustry,
        String desiredPosition,
        ExperienceLevel experienceLevel,
        BigDecimal expectedMonthlyIncome,
        double profileCompletion
) {}
