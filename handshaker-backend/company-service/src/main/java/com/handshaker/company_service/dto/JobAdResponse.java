package com.handshaker.company_service.dto;

import com.handshaker.company_service.enums.SalaryType;
import com.handshaker.company_service.enums.WorkType;

import java.time.LocalDateTime;
import java.util.UUID;

public class JobAdResponse {

    private UUID id;
    private String industry;
    private String position;
    private String description;

    private Location location;

    private WorkType workType;
    private SalaryType salaryType;

    private Double salaryAmount;
    private Integer workingHoursPerDay;
    private Integer workingDaysPerMonth;

    private Boolean accommodationProvided;
    private Boolean transportationProvided;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static class Location {
        public String street;
        public String streetNumber;
        public String city;
        public String postalCode;
        public String country;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
