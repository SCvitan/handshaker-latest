package com.handshaker.profiles_service.controller;

import com.handshaker.profiles_service.dto.*;
import com.handshaker.profiles_service.enums.DocumentType;
import com.handshaker.profiles_service.service.UserProfilesService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserProfileController {

    private final UserProfilesService service;
    private static final Logger log = LoggerFactory.getLogger(UserProfileController.class);


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

    @PutMapping("/me/work-experience")
    public void updateWorkExperience(
            Authentication authentication,
            @RequestBody WorkExperienceRequest request
    ) {
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());
        service.updateWorkExperience(userId, request);
    }

    @PutMapping("/me/education")
    public void updateEducation(
            Authentication authentication,
            @RequestBody EducationRequest request
    ){
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());
        service.updateEducation(userId, request);
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
    public Page<UserProfileResponse> searchProfiles(
            @RequestBody UserProfileSearchRequest request,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return service.search(request, pageable);
    }

    @PostMapping("/me/profile-image")
    public String uploadProfileImage(
            Authentication auth,
            @RequestParam("file") MultipartFile file
    ) {
        log.info("AUTH: " + auth);
        UUID userId = UUID.fromString(auth.getPrincipal().toString());
        return service.uploadProfileImage(userId, file);
    }

    @PostMapping("/me/documents")
    public DocumentUploadResult uploadDocument(
            Authentication authentication,
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") DocumentType type
    ) {
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());
        return service.uploadDocument(userId, file, type);
    }

}
