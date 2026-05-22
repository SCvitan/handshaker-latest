package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.enums.Country;

public record WorkerSummaryResponse(

        String firstName,
        String lastName,

        Country country,

        Boolean hasWorkPermit,
        Boolean inAnotherProcess

) {
}
