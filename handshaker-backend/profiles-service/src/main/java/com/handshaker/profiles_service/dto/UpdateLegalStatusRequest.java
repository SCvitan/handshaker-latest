package com.handshaker.profiles_service.dto;

import java.time.LocalDate;

public record UpdateLegalStatusRequest(
        Boolean hasCroatianWorkPermit,
        LocalDate workPermitExpirationDate,
        String workPermitJobTitle,
        Boolean currentlyEmployedInCroatia,
        LocalDate dateOfArrivalInCroatia,
        LocalDate passportExpirationDate,
        String passportAddress,
        String oib
) {}
