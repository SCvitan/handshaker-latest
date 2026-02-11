package com.handshaker.profiles_service.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "legal_status")
public class LegalStatus {

    @Id
    private UUID id;

    @MapsId
    @OneToOne
    @JoinColumn(name = "profile_id")
    private UserProfile profile;

    private String passportAddress;
    private LocalDate passportExpirationDate;

    private LocalDate dateOfArrivalInCroatia;

    private boolean hasCroatianWorkPermit;
    private String workPermitJobTitle;
    private LocalDate workPermitExpirationDate;

    private boolean currentlyEmployedInCroatia;

    @Column(length = 11, unique = true)
    private String oib;

    public LegalStatus() {}

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

    public String getPassportAddress() {
        return passportAddress;
    }

    public void setPassportAddress(String passportAddress) {
        this.passportAddress = passportAddress;
    }

    public LocalDate getPassportExpirationDate() {
        return passportExpirationDate;
    }

    public void setPassportExpirationDate(LocalDate passportExpirationDate) {
        this.passportExpirationDate = passportExpirationDate;
    }

    public LocalDate getDateOfArrivalInCroatia() {
        return dateOfArrivalInCroatia;
    }

    public void setDateOfArrivalInCroatia(LocalDate dateOfArrivalInCroatia) {
        this.dateOfArrivalInCroatia = dateOfArrivalInCroatia;
    }

    public boolean isHasCroatianWorkPermit() {
        return hasCroatianWorkPermit;
    }

    public void setHasCroatianWorkPermit(boolean hasCroatianWorkPermit) {
        this.hasCroatianWorkPermit = hasCroatianWorkPermit;
    }

    public String getWorkPermitJobTitle() {
        return workPermitJobTitle;
    }

    public void setWorkPermitJobTitle(String workPermitJobTitle) {
        this.workPermitJobTitle = workPermitJobTitle;
    }

    public LocalDate getWorkPermitExpirationDate() {
        return workPermitExpirationDate;
    }

    public void setWorkPermitExpirationDate(LocalDate workPermitExpirationDate) {
        this.workPermitExpirationDate = workPermitExpirationDate;
    }

    public boolean isCurrentlyEmployedInCroatia() {
        return currentlyEmployedInCroatia;
    }

    public void setCurrentlyEmployedInCroatia(boolean currentlyEmployedInCroatia) {
        this.currentlyEmployedInCroatia = currentlyEmployedInCroatia;
    }

    public String getOib() {
        return oib;
    }

    public void setOib(String oib) {
        this.oib = oib;
    }
}
