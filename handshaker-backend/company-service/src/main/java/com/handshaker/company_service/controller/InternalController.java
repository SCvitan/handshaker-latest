package com.handshaker.company_service.controller;

import com.handshaker.company_service.dto.AccessResponse;
import com.handshaker.company_service.repository.ConnectionRepository;
import com.handshaker.company_service.service.CompanyService;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/internal/company")
public class InternalController {

    private final CompanyService companyService;
    private final ConnectionRepository connectionRepository;

    public InternalController(CompanyService companyService, ConnectionRepository connectionRepository) {
        this.companyService = companyService;
        this.connectionRepository = connectionRepository;
    }

    @GetMapping("/access/{companyId}")
    public AccessResponse getAccess(@PathVariable UUID companyId) {
        return companyService.getAccess(companyId);
    }

    @GetMapping("/connections/exists")
    public boolean exists(
            @RequestParam UUID companyId,
            @RequestParam UUID workerId
    ) {
        return connectionRepository.existsByCompanyIdAndWorkerId(
                companyId,
                workerId
        );
    }


}
