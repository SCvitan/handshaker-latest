package com.handshaker.profiles_service.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class UserProfile {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    public UserProfile(){}

    @OneToOne(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private PersonalInfo personalInfo;

    @OneToOne(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private LegalStatus legalStatus;

    @OneToOne(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private JobPreferences jobPreferences;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LanguageSkill> languageSkills = new ArrayList<>();

    @OneToOne(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private Accommodation accommodation;

    public UserProfile(UUID id, String email, PersonalInfo personalInfo, LegalStatus legalStatus, JobPreferences jobPreferences, List<LanguageSkill> languageSkills, Accommodation accommodation) {
        this.id = id;
        this.email = email;
        this.personalInfo = personalInfo;
        this.legalStatus = legalStatus;
        this.jobPreferences = jobPreferences;
        this.languageSkills = languageSkills;
        this.accommodation = accommodation;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public PersonalInfo getPersonalInfo() {
        return personalInfo;
    }

    public void setPersonalInfo(PersonalInfo personalInfo) {
        this.personalInfo = personalInfo;
    }

    public LegalStatus getLegalStatus() {
        return legalStatus;
    }

    public void setLegalStatus(LegalStatus legalStatus) {
        this.legalStatus = legalStatus;
    }

    public JobPreferences getJobPreferences() {
        return jobPreferences;
    }

    public void setJobPreferences(JobPreferences jobPreferences) {
        this.jobPreferences = jobPreferences;
    }

    public List<LanguageSkill> getLanguageSkills() {
        return languageSkills;
    }

    public void setLanguageSkills(List<LanguageSkill> languageSkills) {
        this.languageSkills = languageSkills;
    }

    public Accommodation getAccommodation() {
        return accommodation;
    }

    public void setAccommodation(Accommodation accommodation) {
        this.accommodation = accommodation;
    }
}
