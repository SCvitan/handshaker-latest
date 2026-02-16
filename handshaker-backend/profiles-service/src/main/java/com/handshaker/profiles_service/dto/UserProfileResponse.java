package com.handshaker.profiles_service.dto;


import java.util.List;
import java.util.UUID;

public record UserProfileResponse(
        UUID id,
        String email,
        PersonalInfoResponse personalInfo,
        LegalStatusResponse legalStatus,
        JobPreferencesResponse jobPreferences,
        List<LanguageSkillResponse> languages,
        AccommodationResponse accommodation,
        EmploymentCurrentResponse employmentCurrentResponse,
        double profileCompletion
) {}
