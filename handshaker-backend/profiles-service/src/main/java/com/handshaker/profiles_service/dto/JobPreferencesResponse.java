package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.enums.ExperienceLevel;
import com.handshaker.profiles_service.enums.Industry;

import java.math.BigDecimal;

public record JobPreferencesResponse(
        Industry desiredIndustry,
        String desiredPosition,
        BigDecimal expectedMonthlyIncome,
        boolean accommodationRequired,
        boolean transportationRequired,
        int desiredWorkingHoursPerDay,
        int desiredWorkingDaysPerMonth,
        int yearsOfExperience,
        ExperienceLevel experienceLevel
) {}
