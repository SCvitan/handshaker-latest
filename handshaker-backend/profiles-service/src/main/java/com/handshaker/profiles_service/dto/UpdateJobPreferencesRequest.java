package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.enums.ExperienceLevel;

import java.math.BigDecimal;

public record UpdateJobPreferencesRequest(
        String desiredIndustry,
        String desiredPosition,
        BigDecimal expectedMonthlyIncome,
        boolean accommodationRequired,
        boolean transportationRequired,
        Integer desiredWorkingHoursPerDay,
        Integer desiredWorkingDaysPerMonth,
        Integer yearsOfExperience,
        ExperienceLevel experienceLevel
) {}
