package com.handshaker.profiles_service.dto;


import com.handshaker.profiles_service.enums.JobCategory;

public record EmploymentCurrentResponse(
         JobCategory industry,
         String jobTitleInCroatia,
         String employerName,
         String employerAddress,
         String employerContactInfo,
         String cityOfWork,
         Integer numberOfPreviousEmployersInCroatia,
         AddressResponse workAddress
) {
}
