package com.handshaker.company_service.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OfferRabbitConfig {

    public static final String OFFER_EXCHANGE = "offer.exchange";

    // 🔹 GENERAL (optional)
    public static final String OFFER_EVENTS_QUEUE = "offer.events";

    // 🔹 SPECIFIC
    public static final String OFFER_INTERESTED_QUEUE = "offer.interested.queue";

    @Bean
    public TopicExchange offerExchange() {
        return new TopicExchange(OFFER_EXCHANGE);
    }

    // 🔸 (optional) catch-all queue
    @Bean
    public Queue offerEventsQueue() {
        return QueueBuilder.durable(OFFER_EVENTS_QUEUE).build();
    }

    @Bean
    public Binding offerEventsBinding(Queue offerEventsQueue, TopicExchange offerExchange) {
        return BindingBuilder
                .bind(offerEventsQueue)
                .to(offerExchange)
                .with("offer.#");
    }

    // 🔥 MAIN THING
    @Bean
    public Queue offerInterestedQueue() {
        return QueueBuilder
                .durable(OFFER_INTERESTED_QUEUE)
                .build();
    }

    @Bean
    public Binding offerInterestedBinding(TopicExchange offerExchange) {
        return BindingBuilder
                .bind(offerInterestedQueue())
                .to(offerExchange)
                .with("offer.interested");
    }
}
