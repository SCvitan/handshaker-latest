package com.handshaker.profiles_service.dto;

public record AddressResponse(
        String postalCode,
        String city,
        String street,
        String houseNumber
) {}
