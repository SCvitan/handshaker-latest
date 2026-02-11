package com.handshaker.profiles_service.controller;

import com.handshaker.profiles_service.dto.*;
import com.handshaker.profiles_service.service.UserProfilesService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserProfileController {

    private final UserProfilesService service;

    public UserProfileController(UserProfilesService service) {
        this.service = service;
    }

    @GetMapping("/me")
    public UserProfileResponse getMe(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());
        return service.getMe(userId);
    }

    @PutMapping("/me/personal")
    public void updatePersonal(
            Authentication authentication,
            @RequestBody UpdatePersonalInfoRequest request
    ) {
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());
        service.updatePersonal(userId, request);
    }

    @PutMapping("/me/legal")
    public void updateLegal(
            Authentication authentication,
            @RequestBody UpdateLegalStatusRequest request
    ) {
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());
        service.updateLegal(userId, request);
    }

    @PutMapping("/me/job-preferences")
    public void updateJobPreferences(
            Authentication authentication,
            @RequestBody UpdateJobPreferencesRequest request
    ) {
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());
        service.updateJobPreferences(userId, request);
    }

    @PutMapping("/me/languages")
    public void updateLanguages(
            Authentication authentication,
            @RequestBody List<LanguageSkillRequest> request
    ) {
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());
        service.updateLanguages(userId, request);
    }

    @PutMapping("/me/accommodation")
    public void updateAccommodation(
            Authentication authentication,
            @RequestBody UpdateAccommodationRequest request
    ) {
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());
        service.updateAccommodation(userId, request);
    }

    @PostMapping("/search")
    public List<UserSearchResponse> search(Authentication authentication,
                                           @RequestBody UserSearchRequest request) {
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());
        return service.search(request);
    }


}
