package com.handshaker.profiles_service.service;

import com.handshaker.events.UserRegisteredEvent;
import com.handshaker.profiles_service.enums.DocumentType;
import com.handshaker.profiles_service.enums.Role;
import com.handshaker.profiles_service.model.*;
import com.handshaker.profiles_service.config.RabbitConfig;
import com.handshaker.profiles_service.dto.*;
import com.handshaker.profiles_service.repository.CompanyClient;
import com.handshaker.profiles_service.repository.ConnectionClient;
import com.handshaker.profiles_service.repository.UserProfileRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class UserProfilesService {

    private final UserProfileRepository repository;
    private final ProfileCompletenessCalculator completenessCalculator;
    private final FileStorageService fileStorageService;
    private final CompanyClient companyClient;
    private final AuthUtil authUtil;
    private final ConnectionClient connectionClient;

    private static final Logger log = LoggerFactory.getLogger(UserProfilesService.class);

    public UserProfilesService(UserProfileRepository repository, ProfileCompletenessCalculator completenessCalculator, FileStorageService fileStorageService, CompanyClient companyClient, AuthUtil authUtil, ConnectionClient connectionClient) {
        this.repository = repository;
        this.completenessCalculator = completenessCalculator;
        this.fileStorageService = fileStorageService;
        this.companyClient = companyClient;
        this.authUtil = authUtil;
        this.connectionClient = connectionClient;
    }

    @RabbitListener(queues = RabbitConfig.USER_REGISTERED_QUEUE)
    public void handleUserRegistered(UserRegisteredEvent event){
        log.info("Received UserRegisteredEvent for {} with email {}", event.getUserId(), event.getEmail());
        if (!Objects.equals(event.getRole(), Role.USER.toString())) {
            return;
        }

        UserProfile profile = UserProfile.create(
                event.getUserId(),
                event.getEmail()
        );

        repository.save(profile);
        log.info("User service registred user:  {}", profile.getEmail());
    }

    @Transactional
    public void updatePersonal(UUID userId, UpdatePersonalInfoRequest req) {
        UserProfile profile = repository.findById(userId).orElseThrow(
                () -> new RuntimeException("Cannot find user!")
        );

        PersonalInfo info = profile.getPersonalInfo();
        if (info == null) {
            info = new PersonalInfo();
            info.setProfile(profile);
            profile.setPersonalInfo(info);
        }

        info.setFirstName(req.firstName());
        info.setLastName(req.lastName());
        info.setDateOfBirth(req.dateOfBirth());
        info.setGender(req.gender());
        info.setStateOfOrigin(req.stateOfOrigin());
        info.setCountryOfResidence(req.countryOfResidence());
        info.setMobilePhone(req.mobilePhoneNumber());
        info.setMaritalStatus(req.maritalStatus());
    }

    @Transactional
    public UserProfileResponse getMe(UUID userId) {

        UserProfile profile = getProfile(userId);

        return new UserProfileResponse(
                profile.getId(),
                profile.getEmail(),
                profile.getProfileImageUrl(),
                mapPersonal(profile.getPersonalInfo(), profile),
                mapLegal(profile.getLegalStatus()),
                mapPreferences(profile.getJobPreferences()),
                mapLanguages(profile.getLanguageSkills()),
                mapAccommodation(profile.getAccommodation()),
                mapEducation(profile.getEducation()),
                mapWorkExperiences(profile.getWorkExperiences()),
                mapDocuments(profile.getDocuments()),
                completenessCalculator.calculate(profile)
        );
    }

    @Transactional
    public void replaceLanguages(UUID userId, List<LanguageSkillRequest> request) {

        UserProfile profile = getProfile(userId);

        profile.getLanguageSkills().clear();

        request.forEach(dto -> {
            LanguageSkill skill = new LanguageSkill();
            skill.setProfile(profile);
            skill.setLanguage(dto.language());
            skill.setWritten(dto.written());
            skill.setSpoken(dto.spoken());
            skill.setReading(dto.reading());
            skill.setUnderstanding(dto.understanding());

            profile.getLanguageSkills().add(skill);
        });
    }

    @Transactional
    public void updateLegal(UUID userId, UpdateLegalStatusRequest req) {

        UserProfile profile = getProfile(userId);

        LegalStatus legal = profile.getLegalStatus();
        if (legal == null) {
            legal = new LegalStatus();
            legal.setProfile(profile);
            profile.setLegalStatus(legal);
        }

        legal.setHasCroatianWorkPermit(req.hasCroatianWorkPermit());
        legal.setWorkPermitJobTitle(req.workPermitJobTitle());
        legal.setWorkPermitExpirationDate(req.workPermitExpirationDate());
        legal.setCurrentlyEmployedInCroatia(req.currentlyEmployedInCroatia());
        legal.setDateOfArrivalInCroatia(req.dateOfArrivalInCroatia());
        legal.setPassportExpirationDate(req.passportExpirationDate());
        legal.setPassportAddress(req.passportAddress());
        legal.setOib(req.oib());
        legal.setWorkPermitNoExpiration(req.workPermitNoExpiration());
    }

    @Transactional
    public void updateWorkExperience(UUID userId, WorkExperienceRequest req) {

        UserProfile profile = getProfile(userId);

        profile.getWorkExperiences().clear();

        req.experiences().forEach(dto -> {
            WorkExperience workExperience = new WorkExperience();
            workExperience.setProfile(profile);
            workExperience.setCompanyName(dto.companyName());
            workExperience.setPosition(dto.position());
            workExperience.setYearsOfExperience(dto.yearsOfExperience());
            workExperience.setShortDescription(dto.shortDescription());

            profile.getWorkExperiences().add(workExperience);
        });
    }

    @Transactional
    public void updateEducation(UUID userId, EducationRequest req) {

        UserProfile profile = getProfile(userId);

        Education education = profile.getEducation();

        if (education == null) {
            education = new Education();
            education.setProfile(profile);
            profile.setEducation(education);
        }

        education.setHighestLevel(req.highestLevel());
        education.setSchoolName(req.schoolName());
        education.setTitleAcquired(req.titleAcquired());
        education.setCountry(req.country());
        education.setDateFinished(req.dateFinished());
    }

    @Transactional
    public void updateJobPreferences(UUID userId, UpdateJobPreferencesRequest req) {

        UserProfile profile = getProfile(userId);

        JobPreferences prefs = profile.getJobPreferences();
        if (prefs == null) {
            prefs = new JobPreferences();
            prefs.setProfile(profile);
            profile.setJobPreferences(prefs);
        }

        prefs.setDesiredIndustry(req.desiredIndustry());
        prefs.setDesiredPosition(req.desiredPosition());
        prefs.setExpectedMonthlyIncome(req.expectedMonthlyIncome());
        prefs.setExpectedHourlyPay(req.expectedHourlyPay());
        prefs.setAccommodationRequired(req.accommodationRequired());
        prefs.setTransportationRequired(req.transportationRequired());
        prefs.setDesiredWorkingHoursPerDay(req.desiredWorkingHoursPerDay());
        prefs.setDesiredWorkingDaysPerMonth(req.desiredWorkingDaysPerMonth());
        prefs.setYearsOfExperience(req.yearsOfExperience());
        prefs.setExperienceLevel(req.experienceLevel());

        prefs.getPreferredWorkTypes().clear();
        if (req.preferredWorkTypes() != null) {
            prefs.getPreferredWorkTypes().addAll(req.preferredWorkTypes());
        }
    }

    @Transactional
    public void updateLanguages(UUID userId, List<LanguageSkillRequest> request) {

        UserProfile profile = getProfile(userId);

        profile.getLanguageSkills().clear();

        request.forEach(dto -> {
            LanguageSkill skill = new LanguageSkill();
            skill.setProfile(profile);
            skill.setLanguage(dto.language());
            skill.setWritten(dto.written());
            skill.setSpoken(dto.spoken());
            skill.setReading(dto.reading());
            skill.setUnderstanding(dto.understanding());

            profile.getLanguageSkills().add(skill);
        });
    }

    @Transactional
    public void updateAccommodation(UUID userId, UpdateAccommodationRequest req) {

        UserProfile profile = getProfile(userId);

        Accommodation accommodation = profile.getAccommodation();
        if (accommodation == null) {
            accommodation = new Accommodation();
            accommodation.setProfile(profile);
            profile.setAccommodation(accommodation);
        }

        if (req.address() != null) {
            Address address = accommodation.getAddress();
            if (address == null) {
                address = new Address();
                accommodation.setAddress(address);
            }

            address.setPostalCode(req.address().postalCode());
            address.setCity(req.address().city());
            address.setStreet(req.address().street());
            address.setHouseNumber(req.address().houseNumber());
        }

        accommodation.setProvider(req.provider());
        accommodation.setType(req.type());
        accommodation.setPeopleInAccommodation(req.peopleInAccommodation());
        accommodation.setPeopleInRoom(req.peopleInRoom());
    }


    @Transactional
    public Page<UserProfileResponse> search(
            UserProfileSearchRequest request,
            Pageable pageable,
            Authentication authentication
    ) {

        Specification<UserProfile> spec =
                UserProfileSpecifications.build(request);

        Page<UserProfile> profiles =
                repository.findAll(spec, pageable);

        profiles.forEach(profile -> {
            profile.getLanguageSkills().size();
            profile.getWorkExperiences().size();
            profile.getDocuments().size();
        });

        UUID companyId = authUtil.getCompanyId(authentication);

        return profiles.map(profile -> {

            boolean isConnected =
                    connectionClient.exists(companyId, profile.getId());

            return mapToUserProfileResponsePremium(profile, isConnected);
        });
    }

    @Transactional
    public UserProfileResponse getUserById(UUID id) {

        UserProfile profile = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        profile.getLanguageSkills().size();
        profile.getWorkExperiences().size();
        profile.getDocuments().size();

        return mapToUserProfileResponse(profile);
    }

    @Transactional
    public String uploadProfileImage(UUID userId, MultipartFile file) {
        log.info("File reached the service: " + file);

        UserProfile profile = getProfile(userId);

        log.info("Trying to upload a picture to R2");
        String url = fileStorageService.uploadProfileImage(userId, file);
        profile.setProfileImageUrl(url);

        return url;
    }

    @Transactional
    public DocumentUploadResult uploadDocument(UUID userId, MultipartFile file, DocumentType type) {

        UserProfile profile = getProfile(userId);

        DocumentUploadResult upload = fileStorageService.uploadDocument(userId, file);

        UserDocument doc = new UserDocument();
        doc.setProfile(profile);
        doc.setDocumentType(type);
        doc.setFileUrl(upload.fileUrl());
        doc.setThumbnailUrl(upload.thumbnailUrl());
        doc.setPreviewAvailable(upload.previewAvailable());
        doc.setFileName(file.getOriginalFilename());
        doc.setContentType(file.getContentType());
        doc.setFileSize(file.getSize());
        doc.setUploadedAt(LocalDateTime.now());

        profile.getDocuments().add(doc);

        return upload;
    }

    public List<WorkerDashboardProfileDTO> getDashboardProfiles(
            List<UUID> ids
    ) {

        List<UserProfile> profiles =
                repository.findAllById(ids);

        return profiles.stream()
                .map(profile -> new WorkerDashboardProfileDTO(

                        profile.getId(),

                        profile.getPersonalInfo().getFirstName(),
                        profile.getPersonalInfo().getLastName(),

                        profile.getProfileImageUrl(),

                        profile.getPersonalInfo().getCountryOfCurrentResidence(),

                        profile.getJobPreferences().getDesiredPosition(),
                        profile.getJobPreferences().getDesiredIndustry(),

                        profile.getPersonalInfo().getMobilePhone(),

                        profile.getEmail()
                ))
                .toList();
    }

    public List<ProfileSummaryDTO> getProfileSummaries(List<UUID> ids) {

        return repository.findAllById(ids)
                .stream()
                .map(this::mapToSummary)
                .toList();
    }

    public WorkerSummaryResponse getDashboardSummary(UUID id) {

        UserProfile profile = repository.findById(id)
                .orElseThrow();

        return new WorkerSummaryResponse(
                profile.getPersonalInfo().getFirstName(),
                profile.getPersonalInfo().getLastName(),
                profile.getPersonalInfo().getCountryOfCurrentResidence(),
                profile.getLegalStatus().isHasCroatianWorkPermit(),
                false // inAnotherProcess for now
        );
    }

    private ProfileSummaryDTO mapToSummary(UserProfile profile) {

        ProfileSummaryDTO dto = new ProfileSummaryDTO();

        dto.setId(profile.getId());
        dto.setFirstName(profile.getPersonalInfo().getFirstName());
        dto.setLastName(profile.getPersonalInfo().getLastName());
        dto.setProfileImageUrl(profile.getProfileImageUrl());
        dto.setCountryOfResidence(profile.getPersonalInfo().getCountryOfCurrentResidence());
        dto.setProfession(profile.getJobPreferences().getDesiredPosition());

        return dto;
    }

    private UserProfileResponse mapToUserProfileResponse(UserProfile profile) {
        return new UserProfileResponse(
                profile.getId(),
                profile.getEmail(),
                profile.getProfileImageUrl(),
                mapPersonal(profile.getPersonalInfo(), profile),
                mapLegal(profile.getLegalStatus()),
                mapPreferences(profile.getJobPreferences()),
                mapLanguages(profile.getLanguageSkills()),
                mapAccommodation(profile.getAccommodation()),
                mapEducation(profile.getEducation()),
                mapWorkExperiences(profile.getWorkExperiences()),
                mapDocuments(profile.getDocuments()), // ← add here
                completenessCalculator.calculate(profile)
        );
    }

    private UserProfileResponse mapToUserProfileResponsePremium(
            UserProfile profile,
            boolean isPremium
    ) {
        return new UserProfileResponse(
                profile.getId(),
                isPremium ? profile.getEmail() : null,   // 🔥 mask email
                profile.getProfileImageUrl(),
                mapPersonalPremium(profile.getPersonalInfo(), profile, isPremium),
                mapLegal(profile.getLegalStatus()),
                mapPreferences(profile.getJobPreferences()),
                mapLanguages(profile.getLanguageSkills()),
                mapAccommodation(profile.getAccommodation()),
                mapEducation(profile.getEducation()),
                mapWorkExperiences(profile.getWorkExperiences()),
                mapDocuments(profile.getDocuments()),
                completenessCalculator.calculate(profile)
        );
    }

    private AddressResponse mapAddress(Address address) {
        if (address == null) {
            return null;
        }

        return new AddressResponse(
                address.getPostalCode(),
                address.getCity(),
                address.getStreet(),
                address.getHouseNumber()
        );
    }

    private List<UserDocumentResponse> mapDocuments(List<UserDocument> documents) {
        return documents.stream()
                .map(doc -> new UserDocumentResponse(
                        doc.getId(),
                        doc.getDocumentType(),
                        doc.getFileUrl(),
                        doc.getThumbnailUrl(),
                        doc.getFileName(),
                        doc.getContentType(),
                        doc.isPreviewAvailable(),
                        doc.getUploadedAt()
                ))
                .toList();
    }

    private AccommodationResponse mapAccommodation(Accommodation acc) {

        AddressResponse address = null;
        if (acc.getAddress() != null) {
            address = new AddressResponse(
                    acc.getAddress().getPostalCode(),
                    acc.getAddress().getCity(),
                    acc.getAddress().getStreet(),
                    acc.getAddress().getHouseNumber()
            );
        }

        return new AccommodationResponse(
                address,
                acc.getProvider(),
                acc.getType(),
                acc.getPeopleInAccommodation(),
                acc.getPeopleInRoom()
        );
    }



    private PersonalInfoResponse mapToResponse(UserProfile profile, PersonalInfo info) {
        return new PersonalInfoResponse(
                info.getFirstName(),
                info.getLastName(),
                info.getDateOfBirth(),
                info.getGender(),
                info.getStateOfOrigin(),
                info.getCountryOfCurrentResidence(),
                info.getMobilePhone(),
                info.getMaritalStatus()
        );
    }

    private PersonalInfoResponse mapPersonal(PersonalInfo info, UserProfile profile) {

        return new PersonalInfoResponse(
                info.getFirstName(),
                info.getLastName(),
                info.getDateOfBirth(),
                info.getGender(),
                info.getStateOfOrigin(),
                info.getCountryOfCurrentResidence(),
                info.getMobilePhone(),
                info.getMaritalStatus()

        );
    }

    private PersonalInfoResponse mapPersonalPremium(
            PersonalInfo info,
            UserProfile profile,
            boolean isPremium
    ) {

        return new PersonalInfoResponse(
                isPremium ? info.getFirstName() : null,
                isPremium ? info.getLastName() : null,
                info.getDateOfBirth(),
                info.getGender(),
                info.getStateOfOrigin(),
                info.getCountryOfCurrentResidence(),
                isPremium ? info.getMobilePhone() : null,
                info.getMaritalStatus()
        );
    }

    private List<WorkExperienceResponse> mapWorkExperiences(List<WorkExperience> experiences) {

        if (experiences == null || experiences.isEmpty()) {
            return List.of();
        }

        return experiences.stream()
                .map(exp -> new WorkExperienceResponse(
                        exp.getCompanyName(),
                        exp.getPosition(),
                        exp.getYearsOfExperience(),
                        exp.getShortDescription()
                ))
                .toList();
    }

    private EducationResponse mapEducation(Education education) {

        if (education == null) {
            return null;
        }

        return new EducationResponse(
                education.getHighestLevel(),
                education.getSchoolName(),
                education.getTitleAcquired(),
                education.getCountry(),
                education.getDateFinished()
        );
    }

    private LegalStatusResponse mapLegal(LegalStatus legal) {

        return new LegalStatusResponse(
                legal.isHasCroatianWorkPermit(),
                legal.getWorkPermitExpirationDate(),
                legal.isCurrentlyEmployedInCroatia(),
                legal.getDateOfArrivalInCroatia(),
                legal.getPassportExpirationDate(),
                legal.getOib(),
                legal.isWorkPermitNoExpiration()
        );
    }

    private JobPreferencesResponse  mapPreferences(JobPreferences prefs) {

        return new JobPreferencesResponse(
                prefs.getDesiredIndustry(),
                prefs.getDesiredPosition(),
                prefs.getExpectedMonthlyIncome(),
                prefs.getExpectedHourlyPay(),
                prefs.isAccommodationRequired(),
                prefs.isTransportationRequired(),
                prefs.getDesiredWorkingHoursPerDay(),
                prefs.getDesiredWorkingDaysPerMonth(),
                prefs.getYearsOfExperience(),
                prefs.getExperienceLevel(),
                prefs.getPreferredWorkTypes()
        );
    }

    private List<LanguageSkillResponse> mapLanguages(List<LanguageSkill> skills) {

        if (skills == null || skills.isEmpty()) {
            return List.of();
        }

        return skills.stream()
                .map(skill -> new LanguageSkillResponse(
                        skill.getLanguage(),
                        skill.getWritten(),
                        skill.getSpoken(),
                        skill.getReading(),
                        skill.getUnderstanding()
                ))
                .toList();
    }

    private UserProfile getProfile(UUID userId) {
        return repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

}
