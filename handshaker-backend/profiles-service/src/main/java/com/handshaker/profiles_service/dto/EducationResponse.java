package com.handshaker.profiles_service.dto;

public record EducationResponse(
        String highestLevel,
        String schoolName,
        String titleAcquired,
        String country,
        String dateFinished
) {
}
