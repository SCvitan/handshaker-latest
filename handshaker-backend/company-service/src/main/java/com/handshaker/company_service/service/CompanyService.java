package com.handshaker.company_service.service;

import com.handshaker.company_service.events.UserNotificationEvent;
import com.handshaker.company_service.events.UserRegisteredEvent;
import com.handshaker.company_service.model.Company;
import com.handshaker.company_service.repository.CompanyRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class CompanyService {

    private final CompanyRepository repository;
    private final RabbitTemplate rabbitTemplate;

    public CompanyService(CompanyRepository repository, RabbitTemplate rabbitTemplate) {
        this.repository = repository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @RabbitListener(queues = "user.registered")
    public void handleUserRegistered(UserRegisteredEvent event) {

        if (!event.getRole().equals("COMPANY")) return;

        if (repository.existsById(event.getUserId())) return;

        Company company = new Company();
        company.setId(event.getUserId());
        company.setEmail(event.getEmail());

        repository.save(company);
    }


    public void notifyUser(UserNotificationEvent event) {
        rabbitTemplate.convertAndSend(
                "notifications.exchange",
                "notifications.user",
                    event
            );
        }



}
