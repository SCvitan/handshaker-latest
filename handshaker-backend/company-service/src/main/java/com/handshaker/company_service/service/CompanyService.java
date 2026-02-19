package com.handshaker.company_service.service;

import com.handshaker.company_service.enums.Role;
import com.handshaker.company_service.config.RabbitConfig;
import com.handshaker.company_service.dto.CompanyResponse;
import com.handshaker.company_service.dto.UpdateCompanyRequest;
import com.handshaker.company_service.model.Company;
import com.handshaker.company_service.repository.CompanyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import com.handshaker.events.UserRegisteredEvent;

import java.util.Objects;
import java.util.UUID;


@Service
public class CompanyService {

    private final CompanyRepository repository;
    private static final Logger log = LoggerFactory.getLogger(CompanyService.class);

    public CompanyService(CompanyRepository repository) {
        this.repository = repository;
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

    public CompanyResponse getMe(UUID userId){

        Company company = getCompany(userId);

        return new CompanyResponse(
                company.getId(),
                company.getEmail(),
                company.getCompanyName(),
                company.getDescription(),
                company.getIndustry(),
                company.getPhoneNumber(),
                company.getWebsite(),
                company.getAddress(),
                company.getCity(),
                company.getCountry(),
                company.getCompanySize()

        );
    }

    public void updateCompany(UpdateCompanyRequest request, UUID userId){

        Company company = getCompany(userId);

        company.setCompanyName(request.companyName());
        company.setDescription(request.description());
        company.setIndustry(request.industry());
        company.setPhoneNumber(request.phoneNumber());
        company.setWebsite(request.website());
        company.setAddress(request.address());
        company.setCity(request.city());
        company.setCountry(request.country());
        company.setCompanySize(request.companySize());

        repository.save(company);

    }

    private Company getCompany(UUID userId) {
        return repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
    }

}
