package com.handshaker.company_service.mq;

import com.handshaker.events.offer.OfferInterestedEvent;
import com.handshaker.events.offer.OfferSentEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class OfferEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public OfferEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishOfferSent(OfferSentEvent event) {
        rabbitTemplate.convertAndSend(
                "offer.exchange",
                "offer.sent",
                event
        );
    }

    public void publishOfferInterested(OfferInterestedEvent event) {
        rabbitTemplate.convertAndSend(
                "offer.exchange",
                "offer.interested",
                event
        );
    }
}
