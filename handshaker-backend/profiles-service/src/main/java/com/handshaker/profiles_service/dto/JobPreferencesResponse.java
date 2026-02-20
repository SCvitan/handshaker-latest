package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.enums.ExperienceLevel;
import com.handshaker.profiles_service.enums.Industry;

import java.math.BigDecimal;

public record JobPreferencesResponse(
        Industry desiredIndustry,
        String desiredPosition,
        BigDecimal expectedMonthlyIncome,
        boolean accommodationProvided,
        boolean transportationProvided,
        int workingHoursPerDay,
        int workingDaysPerMonth,
        int yearsOfExperience,
        ExperienceLevel experienceLevel
) {}
