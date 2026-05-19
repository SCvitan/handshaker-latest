package com.handshaker.company_service.model;

import com.handshaker.company_service.enums.OfferStatus;
import com.handshaker.company_service.enums.SalaryType;
import com.handshaker.company_service.enums.WorkType;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "job_offers")
public class JobOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID jobAdId;

    private UUID companyId;
    private UUID workerId;

    // SNAPSHOT of JobAd
    private String industry;
    private String position;
    private String description;

    @Embedded
    private Location location;

    @Enumerated(EnumType.STRING)
    private WorkType workType;

    @Enumerated(EnumType.STRING)
    private SalaryType salaryType;

    private Double salaryAmount;
    private Integer workingHoursPerDay;
    private Integer workingDaysPerMonth;

    private Boolean accommodationProvided;
    private Boolean transportationProvided;

    // interaction state
    @Enumerated(EnumType.STRING)
    private OfferStatus status;

    private boolean contactUnlocked = false;

    private LocalDateTime contactUnlockedAt;

    private LocalDateTime sentAt;
    private LocalDateTime respondedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime viewedAt;

    public LocalDateTime getViewedAt() {
        return viewedAt;
    }

    public void setViewedAt(LocalDateTime viewedAt) {
        this.viewedAt = viewedAt;
    }

    public boolean isContactUnlocked() {
        return contactUnlocked;
    }

    public void setContactUnlocked(boolean contactUnlocked) {
        this.contactUnlocked = contactUnlocked;
    }

    public LocalDateTime getContactUnlockedAt() {
        return contactUnlockedAt;
    }

    public void setContactUnlockedAt(LocalDateTime contactUnlockedAt) {
        this.contactUnlockedAt = contactUnlockedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getJobAdId() {
        return jobAdId;
    }

    public void setJobAdId(UUID jobAdId) {
        this.jobAdId = jobAdId;
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

    public OfferStatus getStatus() {
        return status;
    }

    public void setStatus(OfferStatus status) {
        this.status = status;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }
}
