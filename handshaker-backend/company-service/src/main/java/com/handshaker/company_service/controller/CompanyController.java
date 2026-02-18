package com.handshaker.company_service.controller;

import com.handshaker.company_service.model.Company;
import com.handshaker.company_service.repository.CompanyRepository;
import com.handshaker.company_service.service.CompanyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/companies")
public class CompanyController {

    private final CompanyRepository repository;
    private final CompanyService service;

    public CompanyController(CompanyRepository repository, CompanyService service) {
        this.repository = repository;
        this.service = service;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());
        return repository.findById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(Authentication authentication, @RequestBody Company updated) {
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());

        return repository.findById(userId)
                .map(company -> {
                    company.setName(updated.getName());
                    company.setDescription(updated.getDescription());
                    repository.save(company);
                    return ResponseEntity.ok(company);
                })
                .orElse(ResponseEntity.notFound().build());
    }

}
