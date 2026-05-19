package com.handshaker.events.offer;

import java.time.LocalDateTime;
import java.util.UUID;

public record OfferInterestedEvent(
        UUID offerId,
        UUID companyId,
        UUID workerId,
        LocalDateTime timestamp

) {}