package com.handshaker.company_service.controller;

import com.handshaker.company_service.dto.*;
import com.handshaker.company_service.service.DashboardService;
import com.handshaker.company_service.service.CompanyService;
import com.handshaker.company_service.service.FavouriteProfileService;
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
    private final FavouriteProfileService favouriteProfileService;
    private final DashboardService dashboardService;

    public CompanyController(CompanyService companyService, JobAdService jobAdService, FavouriteProfileService favouriteProfileService, DashboardService dashboardService) {
        this.companyService = companyService;
        this.jobAdService = jobAdService;
        this.favouriteProfileService = favouriteProfileService;
        this.dashboardService = dashboardService;
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
            @PathVariable UUID id,
            Authentication authentication,
            @RequestBody JobAdRequest job
    ) {
        return jobAdService.update(id, getUserId(authentication), job);
    }

    @DeleteMapping("/me/jobs/{id}")
    public void delete(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        jobAdService.delete(id, getUserId(authentication));
    }

    @PostMapping("/me/favourites/{profileId}")
    public void add(
            @PathVariable UUID profileId,
            Authentication authentication
    ) {
        favouriteProfileService.addToFavourites(
                getUserId(authentication),
                profileId
        );
    }

    @GetMapping("/me/favourites")
    public List<ProfileSummaryDTO> get(Authentication authentication) {

        return favouriteProfileService.getFavourites(
                getUserId(authentication)
        );
    }

    @DeleteMapping("/me/favourites/{profileId}")
    public void remove(
            @PathVariable UUID profileId,
            Authentication authentication
    ) {
        favouriteProfileService.remove(
                getUserId(authentication),
                profileId
        );
    }

    @GetMapping("/dashboard")
    public CompanyDashboardResponse dashboard(
            Authentication authentication
    ) {

        UUID companyId =
                UUID.fromString(authentication.getPrincipal().toString());

        return dashboardService.getDashboard(companyId);
    }

    private UUID getUserId(Authentication authentication) {
        return UUID.fromString(authentication.getPrincipal().toString());
    }

}
