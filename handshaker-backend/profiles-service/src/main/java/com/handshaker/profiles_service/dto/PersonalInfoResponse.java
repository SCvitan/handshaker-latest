package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.enums.Country;
import com.handshaker.profiles_service.enums.Gender;
import com.handshaker.profiles_service.enums.MaritalStatus;

import java.time.LocalDate;

public record PersonalInfoResponse(
        String firstName,
        String lastName,
        LocalDate dateOfBirth,
        Gender gender,
        Country stateOfOrigin,
        Country countryOfResidence,
        String mobilePhoneNumber,
        MaritalStatus maritalStatus
) {}
