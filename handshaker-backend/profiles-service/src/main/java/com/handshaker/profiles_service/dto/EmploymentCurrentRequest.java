package com.handshaker.profiles_service.dto;

public record EmploymentCurrentRequest(
        String industry,
        String jobTitleInCroatia,
        String employerName,
        String employerAddress,
        String employerContactInfo,
        String cityOfWork,
        Integer numberOfPreviousEmployersInCroatia,
        AddressRequest workAddress
) {}

