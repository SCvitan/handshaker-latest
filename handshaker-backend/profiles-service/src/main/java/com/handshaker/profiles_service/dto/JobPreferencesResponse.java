package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.enums.ExperienceLevel;
import com.handshaker.profiles_service.enums.JobCategory;
import com.handshaker.profiles_service.enums.WorkType;

import java.math.BigDecimal;
import java.util.List;

public record JobPreferencesResponse(
        JobCategory desiredIndustry,
        String desiredPosition,
        BigDecimal expectedMonthlyIncome,
        BigDecimal expectedHourlyPay,
        boolean accommodationRequired,
        boolean transportationRequired,
        Integer desiredWorkingHoursPerDay,
        Integer desiredWorkingDaysPerMonth,
        Integer yearsOfExperience,
        ExperienceLevel experienceLevel,
        List<WorkType> preferredWorkTypes
) {}
