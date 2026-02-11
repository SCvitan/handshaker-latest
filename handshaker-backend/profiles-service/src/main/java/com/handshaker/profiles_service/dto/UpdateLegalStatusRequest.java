package com.handshaker.profiles_service.dto;

import java.time.LocalDate;

public record UpdateLegalStatusRequest(
        boolean hasCroatianWorkPermit,
        LocalDate workPermitExpirationDate,
        String workPermitJobTitle,
        boolean currentlyEmployedInCroatia,
        LocalDate dateOfArrivalInCroatia,
        LocalDate passportExpirationDate,
        String passportAddress,
        String oib
) {}
