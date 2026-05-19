package com.handshaker.company_service.repository;

import com.handshaker.company_service.dto.JobOfferResponse;
import com.handshaker.company_service.dto.SendOfferRequest;
import com.handshaker.company_service.dto.SendOfferResponse;

import java.util.List;
import java.util.UUID;

public interface OfferServiceInterface {

    SendOfferResponse sendOffer(UUID companyId, SendOfferRequest request);

    List<JobOfferResponse> getWorkerOffers(UUID workerId);

    JobOfferResponse getWorkerOffer(UUID workerId, UUID offerId);

    List<JobOfferResponse> getCompanyOffers(UUID companyId);

    JobOfferResponse getCompanyOffer(UUID companyId, UUID offerId);

    void interested(UUID workerId, UUID offerId);

    void reject(UUID workerId, UUID offerId);

    void unlockContact(UUID companyId, UUID offerId);
}
