package com.handshaker.company_service.dto;

public record WorkerSummaryResponse(

        String firstName,
        String lastName,

        String country,

        boolean hasWorkPermit,

        boolean inAnotherProcess

) {}
