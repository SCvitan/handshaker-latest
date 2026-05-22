package com.handshaker.company_service.service;

import com.handshaker.company_service.dto.CandidateProcessResponse;
import com.handshaker.company_service.dto.CompanyDashboardResponse;
import com.handshaker.company_service.dto.DashboardStatsResponse;
import com.handshaker.company_service.dto.WorkerSummaryResponse;
import com.handshaker.company_service.enums.OfferStatus;
import com.handshaker.company_service.model.Company;
import com.handshaker.company_service.model.JobOffer;
import com.handshaker.company_service.repository.CompanyRepository;
import com.handshaker.company_service.repository.JobOfferRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final CompanyRepository companyRepository;
    private final JobOfferRepository jobOfferRepository;
    private final ProfileClient workerProfileClient;

    public DashboardServiceImpl(CompanyRepository companyRepository, JobOfferRepository jobOfferRepository, ProfileClient workerProfileClient) {
        this.companyRepository = companyRepository;
        this.jobOfferRepository = jobOfferRepository;
        this.workerProfileClient = workerProfileClient;
    }

    @Override
    public CompanyDashboardResponse getDashboard(UUID companyId) {

        Company company = companyRepository.findById(companyId)
                .orElseThrow();

        List<JobOffer> offers =
                jobOfferRepository.findByCompanyIdOrderBySentAtDesc(companyId);

        // 🔹 Stats
        int totalCandidates = offers.size();

        int awaitingResponse = (int) offers.stream()
                .filter(o ->
                        o.getStatus() == OfferStatus.SENT ||
                                o.getStatus() == OfferStatus.VIEWED
                )
                .count();

        int interested = (int) offers.stream()
                .filter(o ->
                        o.getStatus() == OfferStatus.INTERESTED
                                && !o.isContactUnlocked()
                )
                .count();

        int contactUnlocked = (int) offers.stream()
                .filter(JobOffer::isContactUnlocked)
                .count();

        int rejected = (int) offers.stream()
                .filter(o -> o.getStatus() == OfferStatus.REJECTED)
                .count();

        DashboardStatsResponse stats =
                new DashboardStatsResponse(
                        totalCandidates,
                        awaitingResponse,
                        interested,
                        contactUnlocked,
                        rejected
                );

        // 🔹 Candidate cards
        List<CandidateProcessResponse> candidates =
                offers.stream()
                        .map(this::mapToCandidateProcess)
                        .toList();

        return new CompanyDashboardResponse(
                company.getContactTokensRemaining(),
                stats,
                candidates
        );
    }

    private CandidateProcessResponse mapToCandidateProcess(JobOffer offer) {

        WorkerSummaryResponse worker =
                workerProfileClient.getDashboardProfile(offer.getWorkerId());

        boolean contactUnlocked = offer.isContactUnlocked();

        String status =
                contactUnlocked
                        ? "CONTACT_UNLOCKED"
                        : offer.getStatus().name();

        return new CandidateProcessResponse(

                offer.getId(),
                offer.getWorkerId(),

                worker.firstName(),
                worker.lastName(),

                worker.country(),

                offer.getPosition(),
                offer.getIndustry(),

                status,

                worker.hasWorkPermit(),
                worker.inAnotherProcess(),

                contactUnlocked,

                offer.getSalaryAmount(),

                offer.getSentAt(),
                offer.getViewedAt()
        );
    }
}
