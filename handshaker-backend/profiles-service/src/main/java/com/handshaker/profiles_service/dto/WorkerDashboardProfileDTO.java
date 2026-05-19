package com.handshaker.profiles_service.dto;


import com.handshaker.profiles_service.enums.Country;
import com.handshaker.profiles_service.enums.JobCategory;

import java.util.UUID;

public record WorkerDashboardProfileDTO(

        UUID id,

        String firstName,
        String lastName,

        String profileImageUrl,

        Country countryOfResidence,

        String desiredPosition,
        JobCategory desiredIndustry,


        String mobilePhoneNumber,
        String email

) {}
