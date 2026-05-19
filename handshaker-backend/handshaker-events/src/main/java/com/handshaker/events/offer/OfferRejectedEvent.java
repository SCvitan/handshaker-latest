package com.handshaker.events.offer;

import java.time.LocalDateTime;
import java.util.UUID;

public record OfferRejectedEvent(
        UUID offerId,
        UUID workerId,
        LocalDateTime timestamp
) {}
