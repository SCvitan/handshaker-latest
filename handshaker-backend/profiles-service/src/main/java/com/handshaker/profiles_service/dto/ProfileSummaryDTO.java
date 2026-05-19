package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.enums.Country;

import java.util.UUID;

public class ProfileSummaryDTO {

    private UUID id;
    private String firstName;
    private String lastName;
    private String profileImageUrl;
    private Country countryOfResidence;
    private String profession;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public Country getCountryOfResidence() {
        return countryOfResidence;
    }

    public void setCountryOfResidence(Country countryOfResidence) {
        this.countryOfResidence = countryOfResidence;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

}
