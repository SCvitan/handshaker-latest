package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.enums.Industry;

public record EmploymentCurrentRequest(
        Industry industry,
        String jobTitleInCroatia,
        String employerName,
        String employerAddress,
        String employerContactInfo,
        String cityOfWork,
        Integer numberOfPreviousEmployersInCroatia,
        AddressRequest workAddress
) {}

