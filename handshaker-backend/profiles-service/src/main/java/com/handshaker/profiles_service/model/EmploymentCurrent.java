package com.handshaker.profiles_service.model;

import com.handshaker.profiles_service.enums.Industry;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "employment_current")
public class EmploymentCurrent {

    @Id
    private UUID id;

    @MapsId
    @OneToOne
    @JoinColumn(name = "profile_id")
    private UserProfile profile;

    @Enumerated(EnumType.STRING)
    private Industry industry;
    private String jobTitleInCroatia;

    private String employerName;
    private String employerAddress;
    private String employerContactInfo;

    private String cityOfWork;
    private Integer numberOfPreviousEmployersInCroatia;

    @Embedded
    private Address workAddress;

    public EmploymentCurrent() {}

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

    public Industry getIndustry() {
        return industry;
    }

    public void setIndustry(Industry industry) {
        this.industry = industry;
    }

    public String getJobTitleInCroatia() {
        return jobTitleInCroatia;
    }

    public void setJobTitleInCroatia(String jobTitleInCroatia) {
        this.jobTitleInCroatia = jobTitleInCroatia;
    }

    public String getEmployerName() {
        return employerName;
    }

    public void setEmployerName(String employerName) {
        this.employerName = employerName;
    }

    public String getEmployerAddress() {
        return employerAddress;
    }

    public void setEmployerAddress(String employerAddress) {
        this.employerAddress = employerAddress;
    }

    public String getEmployerContactInfo() {
        return employerContactInfo;
    }

    public void setEmployerContactInfo(String employerContactInfo) {
        this.employerContactInfo = employerContactInfo;
    }

    public String getCityOfWork() {
        return cityOfWork;
    }

    public void setCityOfWork(String cityOfWork) {
        this.cityOfWork = cityOfWork;
    }

    public Integer getNumberOfPreviousEmployersInCroatia() {
        return numberOfPreviousEmployersInCroatia;
    }

    public void setNumberOfPreviousEmployersInCroatia(Integer numberOfPreviousEmployersInCroatia) {
        this.numberOfPreviousEmployersInCroatia = numberOfPreviousEmployersInCroatia;
    }

    public Address getWorkAddress() {
        return workAddress;
    }

    public void setWorkAddress(Address workAddress) {
        this.workAddress = workAddress;
    }
}
