package com.handshaker.profiles_service.dto;


public record EducationRequest(
        String highestLevel,
        String schoolName,
        String titleAcquired,
        String country,
        String dateFinished

) {
}
