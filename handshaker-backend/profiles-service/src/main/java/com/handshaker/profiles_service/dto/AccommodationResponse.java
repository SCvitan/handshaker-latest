package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.enums.AccommodationProvider;
import com.handshaker.profiles_service.enums.AccommodationType;
import com.handshaker.profiles_service.enums.PeopleCount;

public record AccommodationResponse(
        AddressResponse address,
        AccommodationProvider provider,
        AccommodationType type,
        PeopleCount peopleInAccommodation,
        PeopleCount peopleInRoom
) {}
