package com.handshaker.profiles_service.model;

import jakarta.persistence.*;

@Entity
@Table(name = "education")
public class Education {

    @Id
    private java.util.UUID id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "profile_id")
    private UserProfile profile;

    private String highestLevel;
    private String schoolName;
    private String titleAcquired;
    private String country;
    private String dateFinished;

    public UserProfile getProfile() {
        return profile;
    }

    public void setProfile(UserProfile profile) {
        this.profile = profile;
    }

    public String getHighestLevel() {
        return highestLevel;
    }

    public void setHighestLevel(String highestLevel) {
        this.highestLevel = highestLevel;
    }

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public String getTitleAcquired() {
        return titleAcquired;
    }

    public void setTitleAcquired(String titleAcquired) {
        this.titleAcquired = titleAcquired;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getDateFinished() {
        return dateFinished;
    }

    public void setDateFinished(String dateFinished) {
        this.dateFinished = dateFinished;
    }
}
