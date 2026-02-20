package com.handshaker.profiles_service.model;

import com.handshaker.profiles_service.enums.ExperienceLevel;
import com.handshaker.profiles_service.enums.Industry;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "job_preferences")
public class JobPreferences {

    @Id
    private UUID id;

    @MapsId
    @OneToOne
    @JoinColumn(name = "profile_id")
    private UserProfile profile;

    @Enumerated(EnumType.STRING)
    private Industry desiredIndustry;
    private String desiredPosition;

    private BigDecimal expectedMonthlyIncome;

    private boolean accommodationRequired;
    private boolean transportationRequired;

    private Integer desiredWorkingHoursPerDay;
    private Integer desiredWorkingDaysPerMonth;

    private Integer yearsOfExperience;

    @Enumerated(EnumType.STRING)
    private ExperienceLevel experienceLevel;

    public JobPreferences() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UserProfile getProfile() {
        return profile;
    }

    public void setProfile(UserProfile profile) {
        this.profile = profile;
    }

    public Industry getDesiredIndustry() {
        return desiredIndustry;
    }

    public void setDesiredIndustry(Industry desiredIndustry) {
        this.desiredIndustry = desiredIndustry;
    }

    public String getDesiredPosition() {
        return desiredPosition;
    }

    public void setDesiredPosition(String desiredPosition) {
        this.desiredPosition = desiredPosition;
    }

    public BigDecimal getExpectedMonthlyIncome() {
        return expectedMonthlyIncome;
    }

    public void setExpectedMonthlyIncome(BigDecimal expectedMonthlyIncome) {
        this.expectedMonthlyIncome = expectedMonthlyIncome;
    }

    public boolean isAccommodationRequired() {
        return accommodationRequired;
    }

    public void setAccommodationRequired(boolean accommodationRequired) {
        this.accommodationRequired = accommodationRequired;
    }

    public boolean isTransportationRequired() {
        return transportationRequired;
    }

    public void setTransportationRequired(boolean transportationRequired) {
        this.transportationRequired = transportationRequired;
    }

    public Integer getDesiredWorkingHoursPerDay() {
        return desiredWorkingHoursPerDay;
    }

    public void setDesiredWorkingHoursPerDay(Integer desiredWorkingHoursPerDay) {
        this.desiredWorkingHoursPerDay = desiredWorkingHoursPerDay;
    }

    public Integer getDesiredWorkingDaysPerMonth() {
        return desiredWorkingDaysPerMonth;
    }

    public void setDesiredWorkingDaysPerMonth(Integer desiredWorkingDaysPerMonth) {
        this.desiredWorkingDaysPerMonth = desiredWorkingDaysPerMonth;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public ExperienceLevel getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(ExperienceLevel experienceLevel) {
        this.experienceLevel = experienceLevel;
    }
}
