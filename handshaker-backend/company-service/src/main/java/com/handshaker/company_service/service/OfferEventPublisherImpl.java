package com.handshaker.company_service.service;

import com.handshaker.company_service.dto.OfferSentEvent;
import com.handshaker.company_service.repository.OfferEventPublisher;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class OfferEventPublisherImpl implements OfferEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public OfferEventPublisherImpl(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public void publishOfferSent(OfferSentEvent event) {
        rabbitTemplate.convertAndSend(
                "offer.exchange",
                "offer.sent",
                event
        );
    }
}
