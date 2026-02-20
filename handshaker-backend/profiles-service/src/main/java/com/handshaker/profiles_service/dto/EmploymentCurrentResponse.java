package com.handshaker.profiles_service.dto;


import com.handshaker.profiles_service.enums.Industry;

public record EmploymentCurrentResponse(
         Industry industry,
         String jobTitleInCroatia,
         String employerName,
         String employerAddress,
         String employerContactInfo,
         String cityOfWork,
         Integer numberOfPreviousEmployersInCroatia,
         AddressResponse workAddress
) {
}
