package com.handshaker.company_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String COMPANY_REGISTERED_QUEUE = "company.user.registered";

    @Bean
    public TopicExchange userExchange() {
        return new TopicExchange("user.events");
    }

    @Bean
    public Queue companyRegisteredQueue() {
        return QueueBuilder
                .durable(COMPANY_REGISTERED_QUEUE)
                .build();
    }

    @Bean
    public JacksonJsonMessageConverter messageConverter() {
        return new JacksonJsonMessageConverter();
    }

    @Bean
    public Binding binding(Queue companyRegisteredQueue,
                           TopicExchange userExchange) {
        return BindingBuilder
                .bind(companyRegisteredQueue)
                .to(userExchange)
                .with("user.registered");
    }
}
