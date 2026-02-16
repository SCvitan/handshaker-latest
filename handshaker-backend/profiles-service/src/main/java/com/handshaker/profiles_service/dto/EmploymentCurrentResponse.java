package com.handshaker.profiles_service.dto;


public record EmploymentCurrentResponse(
         String industry,
         String jobTitleInCroatia,
         String employerName,
         String employerAddress,
         String employerContactInfo,
         String cityOfWork,
         Integer numberOfPreviousEmployersInCroatia,
         AddressResponse workAddress
) {
}
