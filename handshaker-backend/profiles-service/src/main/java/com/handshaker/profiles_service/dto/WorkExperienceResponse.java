package com.handshaker.profiles_service.dto;

public record WorkExperienceResponse(
        String companyName,
        String position,
        String yearsOfExperience,
        String shortDescription
) {
}
