package com.handshaker.company_service.dto;


import java.util.UUID;

public record WorkerDashboardProfileDTO(

        UUID id,

        String firstName,
        String lastName,

        String profileImageUrl,

        String countryOfResidence,

        String desiredPosition,
        String desiredIndustry,

        Boolean currentlyInProcess,

        String mobilePhoneNumber,
        String email

) {}
