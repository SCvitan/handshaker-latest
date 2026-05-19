package com.handshaker.company_service.controller;

import com.handshaker.company_service.dto.JobOfferResponse;
import com.handshaker.company_service.dto.SendOfferRequest;
import com.handshaker.company_service.dto.SendOfferResponse;
import com.handshaker.company_service.repository.OfferServiceInterface;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/company/offers")
public class CompanyOfferController {

    private final OfferServiceInterface offerService;

    public CompanyOfferController(OfferServiceInterface offerService) {
        this.offerService = offerService;
    }

    @PostMapping
    public SendOfferResponse send(
            @RequestBody SendOfferRequest request,
            Authentication authentication
    ) {

        UUID companyId =
                UUID.fromString(authentication.getPrincipal().toString());

        return offerService.sendOffer(companyId, request);
    }

    @GetMapping
    public List<JobOfferResponse> getCompanyOffers(Authentication authentication) {
        return offerService.getCompanyOffers(getUserId(authentication));
    }

    @GetMapping("/{id}")
    public JobOfferResponse getCompanyOffer(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        return offerService.getCompanyOffer(getUserId(authentication), id);
    }

    private UUID getUserId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
