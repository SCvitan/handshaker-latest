package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.model.Accommodation;

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
        double profileCompletion
) {}
