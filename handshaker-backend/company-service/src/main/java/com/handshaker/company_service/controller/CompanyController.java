package com.handshaker.company_service.controller;

import com.handshaker.company_service.dto.CompanyResponse;
import com.handshaker.company_service.dto.JobAdRequest;
import com.handshaker.company_service.dto.JobAdResponse;
import com.handshaker.company_service.dto.UpdateCompanyRequest;
import com.handshaker.company_service.model.JobAd;
import com.handshaker.company_service.service.CompanyService;
import com.handshaker.company_service.service.JobAdService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;
    private final JobAdService jobAdService;

    public CompanyController(CompanyService companyService, JobAdService jobAdService) {
        this.companyService = companyService;
        this.jobAdService = jobAdService;
    }

    @GetMapping("/me")
    public CompanyResponse getMe(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());
        return companyService.getMe(userId);
    }

    @PutMapping("/me")
    public void updateMe(Authentication authentication, @RequestBody UpdateCompanyRequest request) {
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());
        companyService.updateCompany(request, userId);
    }

    @GetMapping("/me/jobs")
    public List<JobAdResponse> getCompanyJobs(Authentication authentication) {
        return jobAdService.getCompanyJobs(getUserId(authentication));
    }

    @PostMapping("/me/jobs")
    public JobAdResponse create(
            Authentication authentication,
            @RequestBody JobAdRequest job
    ) {
        return jobAdService.create(getUserId(authentication), job);
    }

    @PutMapping("/me/jobs/{id}")
    public JobAdResponse update(
            @PathVariable String id,
            Authentication authentication,
            @RequestBody JobAdRequest job
    ) {
        return jobAdService.update(id, getUserId(authentication), job);
    }

    @DeleteMapping("/me/jobs/{id}")
    public void delete(
            @PathVariable String id,
            Authentication authentication
    ) {
        jobAdService.delete(id, getUserId(authentication));
    }

    private UUID getUserId(Authentication authentication) {
        return UUID.fromString(authentication.getPrincipal().toString());
    }

}
