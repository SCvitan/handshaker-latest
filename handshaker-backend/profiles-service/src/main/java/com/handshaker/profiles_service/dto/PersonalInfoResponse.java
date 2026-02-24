package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.enums.Gender;
import com.handshaker.profiles_service.enums.MaritalStatus;
import com.handshaker.profiles_service.enums.StateOfOrigin;

import java.time.LocalDate;

public record PersonalInfoResponse(
        String firstName,
        String lastName,
        LocalDate dateOfBirth,
        Gender gender,
        StateOfOrigin stateOfOrigin,
        String mobilePhoneNumber,
        MaritalStatus maritalStatus,
        Integer numberOfChildren
) {}
