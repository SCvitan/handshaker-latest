package com.handshaker.profiles_service.dto;

public record AddressRequest(
        String postalCode,
        String city,
        String street,
        String houseNumber
) {}
