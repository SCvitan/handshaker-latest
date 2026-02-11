package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.enums.ExperienceLevel;
import com.handshaker.profiles_service.enums.Language;

public record UserSearchRequest(
        String industry,
        String position,
        ExperienceLevel experienceLevel,

        Integer minYearsOfExperience,
        Integer maxYearsOfExperience,

        Integer minExpectedIncome,
        Integer maxExpectedIncome,

        Boolean hasWorkPermit,
        Boolean currentlyEmployed,

        Boolean accommodationRequired,

        Language language,
        Integer minLanguageLevel,

        Double minProfileCompletion
) {}
