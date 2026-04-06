package com.handshaker.profiles_service.dto;


public record WorkExperienceDto(
        String companyName,
        String position,
        String yearsOfExperience,
        String shortDescription
) {
}
