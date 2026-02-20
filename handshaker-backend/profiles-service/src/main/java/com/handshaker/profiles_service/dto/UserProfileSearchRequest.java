package com.handshaker.profiles_service.dto;


import com.handshaker.profiles_service.enums.ExperienceLevel;
import com.handshaker.profiles_service.enums.Gender;
import com.handshaker.profiles_service.enums.Language;
import com.handshaker.profiles_service.enums.MaritalStatus;

import java.math.BigDecimal;

public class UserProfileSearchRequest {

    private String search;

    private Gender gender;
    private MaritalStatus maritalStatus;
    private String stateOfOrigin;

    private Integer minAge;
    private Integer maxAge;

    private Boolean hasWorkPermit;
    private Boolean currentlyEmployed;

    private String industry;
    private String position;

    private ExperienceLevel experienceLevel;
    private Integer minExperienceYears;
    private Integer maxExperienceYears;

    private BigDecimal minIncome;
    private BigDecimal maxIncome;

    private Boolean accommodationRequired;
    private Boolean transportationRequired;

    private Language language;
    private Integer minProficiency;

    private String city;

    public String getSearch() {
        return search;
    }

    public void setSearch(String search) {
        this.search = search;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public MaritalStatus getMaritalStatus() {
        return maritalStatus;
    }

    public void setMaritalStatus(MaritalStatus maritalStatus) {
        this.maritalStatus = maritalStatus;
    }

    public String getStateOfOrigin() {
        return stateOfOrigin;
    }

    public void setStateOfOrigin(String stateOfOrigin) {
        this.stateOfOrigin = stateOfOrigin;
    }

    public Integer getMinAge() {
        return minAge;
    }

    public void setMinAge(Integer minAge) {
        this.minAge = minAge;
    }

    public Integer getMaxAge() {
        return maxAge;
    }

    public void setMaxAge(Integer maxAge) {
        this.maxAge = maxAge;
    }

    public Boolean getHasWorkPermit() {
        return hasWorkPermit;
    }

    public void setHasWorkPermit(Boolean hasWorkPermit) {
        this.hasWorkPermit = hasWorkPermit;
    }

    public Boolean getCurrentlyEmployed() {
        return currentlyEmployed;
    }

    public void setCurrentlyEmployed(Boolean currentlyEmployed) {
        this.currentlyEmployed = currentlyEmployed;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public ExperienceLevel getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(ExperienceLevel experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public Integer getMinExperienceYears() {
        return minExperienceYears;
    }

    public void setMinExperienceYears(Integer minExperienceYears) {
        this.minExperienceYears = minExperienceYears;
    }

    public Integer getMaxExperienceYears() {
        return maxExperienceYears;
    }

    public void setMaxExperienceYears(Integer maxExperienceYears) {
        this.maxExperienceYears = maxExperienceYears;
    }

    public BigDecimal getMinIncome() {
        return minIncome;
    }

    public void setMinIncome(BigDecimal minIncome) {
        this.minIncome = minIncome;
    }

    public BigDecimal getMaxIncome() {
        return maxIncome;
    }

    public void setMaxIncome(BigDecimal maxIncome) {
        this.maxIncome = maxIncome;
    }

    public Boolean getAccommodationRequired() {
        return accommodationRequired;
    }

    public void setAccommodationRequired(Boolean accommodationRequired) {
        this.accommodationRequired = accommodationRequired;
    }

    public Boolean getTransportationRequired() {
        return transportationRequired;
    }

    public void setTransportationRequired(Boolean transportationRequired) {
        this.transportationRequired = transportationRequired;
    }

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public Integer getMinProficiency() {
        return minProficiency;
    }

    public void setMinProficiency(Integer minProficiency) {
        this.minProficiency = minProficiency;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}
