package com.handshaker.profiles_service.dto;

import java.time.LocalDate;

public record LegalStatusResponse(
        boolean hasWorkPermit,
        LocalDate workPermitExpirationDate,
        boolean currentlyEmployedInCroatia,
        LocalDate dateOfArrivalInCroatia,
        LocalDate passportExpirationDate,
        String oib
) {}
