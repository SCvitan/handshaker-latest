package com.handshaker.profiles_service.dto;

import java.time.LocalDate;

public record LegalStatusResponse(
        Boolean hasCroatianWorkPermit,
        LocalDate workPermitExpirationDate,
        Boolean currentlyEmployedInCroatia,
        LocalDate dateOfArrivalInCroatia,
        LocalDate passportExpirationDate,
        String oib
) {}
