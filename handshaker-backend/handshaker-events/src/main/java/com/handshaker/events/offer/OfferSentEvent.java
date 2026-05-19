package com.handshaker.events.offer;

import java.time.LocalDateTime;
import java.util.UUID;

public record OfferSentEvent (

     UUID offerId,
     UUID companyId,
     UUID workerId,

     String position,
     String industry,

     LocalDateTime sentAt

) {}