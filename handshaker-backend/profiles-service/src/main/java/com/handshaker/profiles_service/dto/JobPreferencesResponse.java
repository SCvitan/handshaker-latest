package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.enums.ExperienceLevel;

import java.math.BigDecimal;

public record JobPreferencesResponse(
        String industry,
        String position,
        BigDecimal expectedMonthlyIncome,
        boolean accommodationProvided,
        boolean transportationProvided,
        int workingHoursPerDay,
        int workingDaysPerMonth,
        int yearsOfExperience,
        ExperienceLevel experienceLevel
) {}
