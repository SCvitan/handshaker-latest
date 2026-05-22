package com.handshaker.company_service.service;

import com.handshaker.company_service.dto.JobOfferResponse;
import com.handshaker.company_service.dto.OfferSentEvent;
import com.handshaker.company_service.dto.SendOfferRequest;
import com.handshaker.company_service.dto.SendOfferResponse;
import com.handshaker.company_service.enums.OfferStatus;
import com.handshaker.company_service.model.Company;
import com.handshaker.company_service.model.Connection;
import com.handshaker.company_service.model.JobAd;
import com.handshaker.company_service.model.JobOffer;
import com.handshaker.company_service.repository.*;
import com.handshaker.events.offer.OfferInterestedEvent;
import com.handshaker.events.offer.OfferRejectedEvent;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OfferServiceImpl implements OfferServiceInterface {

    private static final Logger log = LoggerFactory.getLogger(OfferServiceImpl.class);

    private final JobOfferRepository repository;
    private final JobAdRepository jobAdRepository;
    private final CompanyRepository companyRepository;
    private final OfferEventPublisher offerEventPublisher;
    private final RabbitTemplate rabbitTemplate;
    private final ConnectionRepository connectionRepository;

    public OfferServiceImpl(JobOfferRepository repository, JobAdRepository jobAdRepository, CompanyRepository companyRepository, OfferEventPublisher offerEventPublisher, RabbitTemplate rabbitTemplate, ConnectionRepository connectionRepository) {
        this.repository = repository;
        this.jobAdRepository = jobAdRepository;
        this.companyRepository = companyRepository;
        this.offerEventPublisher = offerEventPublisher;
        this.rabbitTemplate = rabbitTemplate;
        this.connectionRepository = connectionRepository;
    }

    // =========================
    // WORKER SIDE
    // =========================

    @Override
    public List<JobOfferResponse> getWorkerOffers(UUID workerId) {
        return repository.findByWorkerId(workerId)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public JobOfferResponse getWorkerOffer(UUID workerId, UUID offerId) {

        JobOffer offer = repository.findById(offerId)
                .orElseThrow();

        if (!offer.getWorkerId().equals(workerId)) {
            throw new RuntimeException("Not allowed");
        }

        // mark as viewed
        if (offer.getStatus() == OfferStatus.SENT) {
            offer.setStatus(OfferStatus.VIEWED);
            offer.setUpdatedAt(LocalDateTime.now());
            repository.save(offer);
        }

        return map(offer);
    }

    @Transactional
    @Override
    public void interested(UUID workerId, UUID offerId) {

        int updated = repository.markInterested(offerId, workerId);

        if (updated == 0) {
            throw new RuntimeException("Already processed or invalid");
        }

        JobOffer offer = repository.findById(offerId)
                .orElseThrow();

        OfferInterestedEvent event = new OfferInterestedEvent(
                offer.getId(),
                offer.getCompanyId(),
                offer.getWorkerId(),
                LocalDateTime.now()
        );

        rabbitTemplate.convertAndSend(
                "offer.exchange",
                "offer.interested",
                event
        );
    }

    @Transactional
    @Override
    public void reject(UUID workerId, UUID offerId) {

        int updated = repository.markRejected(offerId, workerId);

        if (updated == 0) {
            throw new RuntimeException("Already processed or invalid");
        }

        // opcionalno: event (ako želiš analytics / notifikacije)
        OfferRejectedEvent event = new OfferRejectedEvent(
                offerId,
                workerId,
                LocalDateTime.now()
        );

        rabbitTemplate.convertAndSend(
                "offer.exchange",
                "offer.rejected",
                event
        );
    }

    // =========================
    // COMPANY SIDE
    // =========================

    @Override
    public List<JobOfferResponse> getCompanyOffers(UUID companyId) {
        return repository.findByCompanyId(companyId)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public JobOfferResponse getCompanyOffer(UUID companyId, UUID offerId) {

        JobOffer offer = repository.findById(offerId)
                .orElseThrow();

        if (!offer.getCompanyId().equals(companyId)) {
            throw new RuntimeException("Not allowed");
        }

        return map(offer);
    }

    // =========================
    // SEND OFFER FLOW (CORE LOGIC)
    // =========================

    @Transactional
    @Override
    public SendOfferResponse sendOffer(UUID companyId, SendOfferRequest request) {

        Company company = companyRepository.findById(companyId)
                .orElseThrow();

        if (!company.getPremium()) {
            throw new RuntimeException("Not premium");
        }

        JobAd jobAd = jobAdRepository.findById(request.getJobAdId())
                .orElseThrow();

        JobOffer offer = new JobOffer();

        offer.setJobAdId(jobAd.getId());
        offer.setCompanyId(companyId);
        offer.setWorkerId(request.getWorkerId());

        offer.setIndustry(jobAd.getIndustry());
        offer.setPosition(jobAd.getPosition());
        offer.setDescription(jobAd.getDescription());
        offer.setLocation(jobAd.getLocation());
        offer.setWorkType(jobAd.getWorkType());
        offer.setSalaryType(jobAd.getSalaryType());
        offer.setSalaryAmount(jobAd.getSalaryAmount());
        offer.setWorkingHoursPerDay(jobAd.getWorkingHoursPerDay());
        offer.setWorkingDaysPerMonth(jobAd.getWorkingDaysPerMonth());

        offer.setStatus(OfferStatus.SENT);
        offer.setSentAt(LocalDateTime.now());

        JobOffer saved = repository.save(offer);

        offerEventPublisher.publishOfferSent(
                new OfferSentEvent(
                        saved.getId(),
                        companyId,
                        request.getWorkerId(),
                        offer.getPosition(),
                        offer.getIndustry(),
                        offer.getSentAt()
                )
        );

        return new SendOfferResponse(saved.getId());
    }

    @Transactional
    @Override
    public void unlockContact(UUID companyId, UUID offerId) {

        JobOffer offer = repository.findById(offerId)
                .orElseThrow();

        if (!offer.getCompanyId().equals(companyId)) {
            throw new RuntimeException("Not allowed");
        }

        if (offer.getStatus() != OfferStatus.INTERESTED) {
            throw new RuntimeException("Worker not interested");
        }

        if (offer.isContactUnlocked()) {
            return;
        }

        Company company = companyRepository.findById(companyId)
                .orElseThrow();

        if (company.getContactTokensRemaining() <= 0) {
            throw new RuntimeException("No tokens");
        }

        company.setContactTokensRemaining(
                company.getContactTokensRemaining() - 1
        );

        companyRepository.save(company);

        offer.setContactUnlocked(true);
        offer.setContactUnlockedAt(LocalDateTime.now());

        repository.save(offer);

        boolean exists = connectionRepository
                .existsByCompanyIdAndWorkerId(
                        companyId,
                        offer.getWorkerId()
                );

        if (!exists) {

            Connection connection = new Connection();

            connection.setCompanyId(companyId);
            connection.setWorkerId(offer.getWorkerId());

            connectionRepository.save(connection);
        }
    }

    // =========================
    // MAPPER
    // =========================

    private JobOfferResponse map(JobOffer offer) {

        JobOfferResponse response = new JobOfferResponse();

        response.setId(offer.getId());
        response.setCompanyId(offer.getCompanyId());
        response.setWorkerId(offer.getWorkerId());
        response.setStatus(offer.getStatus());

        response.setCreatedAt(offer.getSentAt());

        response.setJobAdId(offer.getJobAdId());

        response.setPosition(offer.getPosition());
        response.setIndustry(offer.getIndustry());
        response.setDescription(offer.getDescription());

        response.setLocation(offer.getLocation());
        response.setWorkType(offer.getWorkType());
        response.setSalaryType(offer.getSalaryType());
        response.setSalaryAmount(offer.getSalaryAmount());
        response.setWorkingHoursPerDay(offer.getWorkingHoursPerDay());
        response.setWorkingDaysPerMonth(offer.getWorkingDaysPerMonth());
        response.setAccommodationProvided(offer.getAccommodationProvided());
        response.setTransportationProvided(offer.getTransportationProvided());

        return response;
    }
}