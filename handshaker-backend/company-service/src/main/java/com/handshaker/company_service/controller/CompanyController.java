package com.handshaker.company_service.controller;

import com.handshaker.company_service.dto.CompanyResponse;
import com.handshaker.company_service.dto.UpdateCompanyRequest;
import com.handshaker.company_service.service.CompanyService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/companies")
public class CompanyController {

    private final CompanyService service;

    public CompanyController(CompanyService service) {
        this.service = service;
    }

    @GetMapping("/me")
    public CompanyResponse getMe(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());
        return service.getMe(userId);
    }

    @PutMapping("/me")
    public void updateMe(Authentication authentication, @RequestBody UpdateCompanyRequest request) {
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());
        service.updateCompany(request, userId);
    }

}
