package com.handshaker.profiles_service.service;

import com.handshaker.events.UserRegisteredEvent;
import com.handshaker.profiles_service.enums.Role;
import com.handshaker.profiles_service.model.*;
import com.handshaker.profiles_service.config.RabbitConfig;
import com.handshaker.profiles_service.dto.*;
import com.handshaker.profiles_service.repository.UserProfileRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.AbstractMap;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class UserProfilesService {

    private final UserProfileRepository repository;
    private final ProfileCompletenessCalculator completenessCalculator;
    private static final Logger log = LoggerFactory.getLogger(UserProfilesService.class);

    public UserProfilesService(UserProfileRepository repository, ProfileCompletenessCalculator completenessCalculator) {
        this.repository = repository;
        this.completenessCalculator = completenessCalculator;
    }


    @RabbitListener(queues = RabbitConfig.USER_REGISTERED_QUEUE)
    public void handleUserRegistered(UserRegisteredEvent event){
        log.info("Received UserRegisteredEvent for {} with email {}", event.getUserId(), event.getEmail());
        if (!Objects.equals(event.getRole(), Role.USER.toString())) {
            return;
        }

        UserProfile profile = new UserProfile();
        profile.setId(event.getUserId());
        profile.setEmail(event.getEmail());

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
        info.setMobilePhone(req.mobilePhoneNumber());
        info.setMaritalStatus(req.maritalStatus());
        info.setNumberOfChildren(req.numberOfChildren());
    }

    @Transactional
    public UserProfileResponse getMe(UUID userId) {

        UserProfile profile = getProfile(userId);

        return new UserProfileResponse(
                profile.getId(),
                profile.getEmail(),
                mapPersonal(profile.getPersonalInfo(), profile),
                mapLegal(profile.getLegalStatus()),
                mapPreferences(profile.getJobPreferences()),
                mapLanguages(profile.getLanguageSkills()),
                mapAccommodation(profile.getAccommodation()),
                mapEmploymentCurrent(profile.getEmploymentCurrent()),
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
        prefs.setAccommodationRequired(req.accommodationRequired());
        prefs.setTransportationRequired(req.transportationRequired());
        prefs.setDesiredWorkingHoursPerDay(req.desiredWorkingHoursPerDay());
        prefs.setDesiredWorkingDaysPerMonth(req.desiredWorkingDaysPerMonth());
        prefs.setYearsOfExperience(req.yearsOfExperience());
        prefs.setExperienceLevel(req.experienceLevel());
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
    public void updateEmploymentCurrent(
            UUID userId,
            EmploymentCurrentRequest request
    ) {

        UserProfile profile = getProfile(userId);

        EmploymentCurrent employment = profile.getEmploymentCurrent();

        if (employment == null) {
            employment = new EmploymentCurrent();
            employment.setId(profile.getId()); // VERY IMPORTANT for @MapsId
            employment.setProfile(profile);
            profile.setEmploymentCurrent(employment);
        }

        employment.setIndustry(request.industry());
        employment.setJobTitleInCroatia(request.jobTitleInCroatia());
        employment.setEmployerName(request.employerName());
        employment.setEmployerAddress(request.employerAddress());
        employment.setEmployerContactInfo(request.employerContactInfo());
        employment.setCityOfWork(request.cityOfWork());
        employment.setNumberOfPreviousEmployersInCroatia(
                request.numberOfPreviousEmployersInCroatia()
        );

        if (request.workAddress() != null) {
            Address address = employment.getWorkAddress();

            if (address == null) {
                address = new Address();
            }

            address.setPostalCode(request.workAddress().postalCode());
            address.setCity(request.workAddress().city());
            address.setStreet(request.workAddress().street());
            address.setHouseNumber(request.workAddress().houseNumber());

            employment.setWorkAddress(address);
        } else {
            employment.setWorkAddress(null);
        }
    }

    @Transactional
    public List<UserSearchResponse> search(UserSearchRequest request) {

        List<UserProfile> users =
                repository.findAll(UserProfileSpecifications.withFilters(request, completenessCalculator));

        return users.stream()
                .map(profile -> {
                    double completion = completenessCalculator.calculate(profile);
                    return new AbstractMap.SimpleEntry<>(profile, completion);
                })
                .filter(entry ->
                        request.minProfileCompletion() == null ||
                                entry.getValue() >= request.minProfileCompletion()
                )
                .map(entry -> mapToSearchResponse(entry.getKey(), entry.getValue()))
                .toList();
    }

    private EmploymentCurrentResponse mapEmploymentCurrent(EmploymentCurrent employmentCurrent) {

        if (employmentCurrent == null) {
            return null;
        }

        AddressResponse addressResponse = null;

        if (employmentCurrent.getWorkAddress() != null) {
            addressResponse = new AddressResponse(
                    employmentCurrent.getWorkAddress().getPostalCode(),
                    employmentCurrent.getWorkAddress().getCity(),
                    employmentCurrent.getWorkAddress().getStreet(),
                    employmentCurrent.getWorkAddress().getHouseNumber()
            );
        }

        return new EmploymentCurrentResponse(
                employmentCurrent.getIndustry(),
                employmentCurrent.getJobTitleInCroatia(),
                employmentCurrent.getEmployerName(),
                employmentCurrent.getEmployerAddress(),
                employmentCurrent.getEmployerContactInfo(),
                employmentCurrent.getCityOfWork(),
                employmentCurrent.getNumberOfPreviousEmployersInCroatia(),
                addressResponse
        );
    }

    private UserSearchResponse mapToSearchResponse(UserProfile profile, double completion) {

        PersonalInfo pi = profile.getPersonalInfo(); // safe null handling
        JobPreferences prefs = profile.getJobPreferences();

        String firstName = pi != null ? pi.getFirstName() : null;
        String lastName = pi != null ? pi.getLastName() : null;

        return new UserSearchResponse(
                profile.getId(),
                firstName,
                lastName,
                prefs != null ? prefs.getDesiredIndustry() : null,
                prefs != null ? prefs.getDesiredPosition() : null,
                prefs != null ? prefs.getExperienceLevel() : null,
                prefs != null ? prefs.getExpectedMonthlyIncome() : null,
                completion
        );
    }

    private AccommodationResponse mapAccommodation(Accommodation acc) {

        if (acc == null) {
            return null;
        }

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
                info.getMobilePhone(),
                info.getMaritalStatus(),
                info.getNumberOfChildren()
        );
    }

    private PersonalInfoResponse mapPersonal(PersonalInfo info, UserProfile profile) {

        if (info == null) {
            return null;
        }

        return new PersonalInfoResponse(
                info.getFirstName(),
                info.getLastName(),
                info.getDateOfBirth(),
                info.getGender(),
                info.getStateOfOrigin(),
                info.getMobilePhone(),
                info.getMaritalStatus(),
                info.getNumberOfChildren()

        );
    }

    private LegalStatusResponse mapLegal(LegalStatus legal) {

        if (legal == null) {
            return null;
        }

        return new LegalStatusResponse(
                legal.isHasCroatianWorkPermit(),
                legal.getWorkPermitExpirationDate(),
                legal.isCurrentlyEmployedInCroatia(),
                legal.getDateOfArrivalInCroatia(),
                legal.getPassportExpirationDate(),
                legal.getOib()
        );
    }

    private JobPreferencesResponse mapPreferences(JobPreferences prefs) {

        if (prefs == null) {
            return null;
        }

        return new JobPreferencesResponse(
                prefs.getDesiredIndustry(),
                prefs.getDesiredPosition(),
                prefs.getExpectedMonthlyIncome(),
                prefs.isAccommodationRequired(),
                prefs.isTransportationRequired(),
                prefs.getDesiredWorkingHoursPerDay(),
                prefs.getDesiredWorkingDaysPerMonth(),
                prefs.getYearsOfExperience(),
                prefs.getExperienceLevel()
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
