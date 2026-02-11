package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.enums.Gender;
import com.handshaker.profiles_service.enums.MaritalStatus;

import java.time.LocalDate;

public record PersonalInfoResponse(
        String firstName,
        String lastName,
        LocalDate dateOfBirth,
        Gender gender,
        String stateOfOrigin,
        String mobilePhone,
        MaritalStatus maritalStatus,
        Integer numberOfChildren
) {}
