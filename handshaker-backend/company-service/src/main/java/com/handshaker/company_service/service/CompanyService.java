package com.handshaker.company_service.service;

import com.handshaker.company_service.Role;
import com.handshaker.company_service.config.RabbitConfig;
import com.handshaker.company_service.model.Company;
import com.handshaker.company_service.repository.CompanyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import com.handshaker.events.UserRegisteredEvent;

import java.util.Objects;


@Service
public class CompanyService {

    private final CompanyRepository repository;
    private final RabbitTemplate rabbitTemplate;
    private static final Logger log = LoggerFactory.getLogger(CompanyService.class);

    public CompanyService(CompanyRepository repository, RabbitTemplate rabbitTemplate) {
        this.repository = repository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @RabbitListener(queues = RabbitConfig.COMPANY_REGISTERED_QUEUE)
    public void handleUserRegistered(UserRegisteredEvent event) {
        log.info("Received UserRegisteredEvent for {} with email {}", event.getUserId(), event.getEmail());
        if (!Objects.equals(event.getRole(), Role.COMPANY.toString())) {
            return;
        }

        Company profile = new Company();
        profile.setId(event.getUserId());
        profile.setEmail(event.getEmail());

        repository.save(profile);
        log.info("Company service registred company:  {}", profile.getEmail());
    }

}
