package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.enums.ExperienceLevel;
import com.handshaker.profiles_service.enums.Industry;

import java.math.BigDecimal;

public record UpdateJobPreferencesRequest(
        Industry desiredIndustry,
        String desiredPosition,
        BigDecimal expectedMonthlyIncome,
        Boolean accommodationRequired,
        Boolean transportationRequired,
        Integer desiredWorkingHoursPerDay,
        Integer desiredWorkingDaysPerMonth,
        Integer yearsOfExperience,
        ExperienceLevel experienceLevel
) {}
