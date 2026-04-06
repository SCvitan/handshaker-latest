package com.handshaker.profiles_service.dto;



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
        EducationResponse education,
        List<WorkExperienceResponse> workExperiences,
        List<UserDocumentResponse> documents,
        Double profileCompletion
) {}
