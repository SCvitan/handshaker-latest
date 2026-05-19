package com.handshaker.company_service.service;

import com.handshaker.company_service.dto.SubscriptionResponse;
import com.handshaker.company_service.enums.SubscriptionPlan;
import com.handshaker.company_service.model.Company;
import com.handshaker.company_service.repository.CompanyRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class SubscriptionService {

    private final CompanyRepository companyRepository;

    public SubscriptionService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public SubscriptionResponse activate(UUID userId, SubscriptionPlan plan) {

        Company company = companyRepository.findById(userId)
                .orElseThrow();

        company.setSubscriptionPlan(plan);
        company.setAiSearchRemaining(plan.getAiSearchCount());
        company.setContactTokensRemaining(plan.getTokenCount());
        company.setSubscriptionStartDate(LocalDate.now());
        company.setSubscriptionEndDate(LocalDate.now().plusMonths(1));
        company.setPremium(true);

        companyRepository.save(company);
        return map(company);
    }

    public SubscriptionResponse getCurrent(UUID userId) {

        Company company = companyRepository.findById(userId)
                .orElseThrow();

        return map(company);
    }

    private SubscriptionResponse map(Company company) {

        SubscriptionResponse res = new SubscriptionResponse();

        res.setPlan(company.getSubscriptionPlan());
        res.setAiSearchRemaining(company.getAiSearchRemaining());
        res.setContactTokensRemaining(company.getContactTokensRemaining());
        res.setSubscriptionEndDate(company.getSubscriptionEndDate());

        boolean active =
                company.getSubscriptionEndDate() != null &&
                        company.getSubscriptionEndDate().isAfter(LocalDate.now());

        res.setActive(active);

        return res;
    }
}
