package com.handshaker.company_service.dto;

import com.handshaker.company_service.enums.OfferStatus;
import com.handshaker.company_service.enums.SalaryType;
import com.handshaker.company_service.enums.WorkType;
import com.handshaker.company_service.model.Location;

import java.time.LocalDateTime;
import java.util.UUID;

public class JobOfferResponse {

    private UUID id;

    private UUID companyId;
    private UUID workerId;

    private OfferStatus status;

    private LocalDateTime createdAt;

    // JobAd data

    private UUID jobAdId;

    private String industry;
    private String position;

    private Location location;

    private WorkType workType;

    private SalaryType salaryType;

    private Double salaryAmount;

    private Integer workingHoursPerDay;
    private Integer workingDaysPerMonth;

    private Boolean accommodationProvided;
    private Boolean transportationProvided;

    private String description;

    // getters & setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getCompanyId() {
        return companyId;
    }

    public void setCompanyId(UUID companyId) {
        this.companyId = companyId;
    }

    public UUID getWorkerId() {
        return workerId;
    }

    public void setWorkerId(UUID workerId) {
        this.workerId = workerId;
    }

    public OfferStatus getStatus() {
        return status;
    }

    public void setStatus(OfferStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public UUID getJobAdId() {
        return jobAdId;
    }

    public void setJobAdId(UUID jobAdId) {
        this.jobAdId = jobAdId;
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

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public WorkType getWorkType() {
        return workType;
    }

    public void setWorkType(WorkType workType) {
        this.workType = workType;
    }

    public SalaryType getSalaryType() {
        return salaryType;
    }

    public void setSalaryType(SalaryType salaryType) {
        this.salaryType = salaryType;
    }

    public Double getSalaryAmount() {
        return salaryAmount;
    }

    public void setSalaryAmount(Double salaryAmount) {
        this.salaryAmount = salaryAmount;
    }

    public Integer getWorkingHoursPerDay() {
        return workingHoursPerDay;
    }

    public void setWorkingHoursPerDay(Integer workingHoursPerDay) {
        this.workingHoursPerDay = workingHoursPerDay;
    }

    public Integer getWorkingDaysPerMonth() {
        return workingDaysPerMonth;
    }

    public void setWorkingDaysPerMonth(Integer workingDaysPerMonth) {
        this.workingDaysPerMonth = workingDaysPerMonth;
    }

    public Boolean getAccommodationProvided() {
        return accommodationProvided;
    }

    public void setAccommodationProvided(Boolean accommodationProvided) {
        this.accommodationProvided = accommodationProvided;
    }

    public Boolean getTransportationProvided() {
        return transportationProvided;
    }

    public void setTransportationProvided(Boolean transportationProvided) {
        this.transportationProvided = transportationProvided;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
