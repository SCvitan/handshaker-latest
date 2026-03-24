package com.handshaker.profiles_service.dto;


import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.util.List;
import java.util.UUID;

public record UserProfileResponse(
        UUID id,
        String email,
        String profileImageUrl,
        PersonalInfoResponse personalInfo,
        LegalStatusResponse legalStatus,
        JobPreferencesResponse jobPreferences,
        List<LanguageSkillResponse> languages,
        AccommodationResponse accommodation,
        EmploymentCurrentResponse employmentCurrent,
        Double profileCompletion
) {}
