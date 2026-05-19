package com.handshaker.company_service.controller;


import com.handshaker.company_service.dto.JobOfferResponse;
import com.handshaker.company_service.repository.OfferServiceInterface;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    private final OfferServiceInterface offerService;

    public OfferController(OfferServiceInterface offerService) {
        this.offerService = offerService;
    }

    @GetMapping("/me")
    public List<JobOfferResponse> getMyOffers(Authentication authentication) {
        return offerService.getWorkerOffers(getUserId(authentication));
    }

    @GetMapping("/{id}")
    public JobOfferResponse getOffer(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        return offerService.getWorkerOffer(getUserId(authentication), id);
    }

    @PostMapping("/{id}/interested")
    public void interested(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        offerService.interested(getUserId(authentication), id);
    }

    @PostMapping("/{id}/reject")
    public void reject(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        offerService.reject(getUserId(authentication), id);
    }

    private UUID getUserId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
