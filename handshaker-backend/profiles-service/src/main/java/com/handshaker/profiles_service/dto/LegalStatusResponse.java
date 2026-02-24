package com.handshaker.profiles_service.dto;

import java.time.LocalDate;

public record LegalStatusResponse(
        boolean hasCroatianWorkPermit,
        LocalDate workPermitExpirationDate,
        boolean currentlyEmployedInCroatia,
        LocalDate dateOfArrivalInCroatia,
        LocalDate passportExpirationDate,
        String oib
) {}
