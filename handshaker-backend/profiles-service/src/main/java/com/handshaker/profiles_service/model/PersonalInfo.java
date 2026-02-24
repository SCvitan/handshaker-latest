package com.handshaker.profiles_service.model;

import com.handshaker.profiles_service.enums.Gender;
import com.handshaker.profiles_service.enums.MaritalStatus;
import com.handshaker.profiles_service.enums.StateOfOrigin;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "personal_info")
public class PersonalInfo {

    @Id
    private UUID id;

    @MapsId
    @OneToOne
    @JoinColumn(name = "profile_id")
    private UserProfile profile;

    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private StateOfOrigin stateOfOrigin;
    private String mobilePhone;

    @Enumerated(EnumType.STRING)
    private MaritalStatus maritalStatus;

    private Integer numberOfChildren;


    public PersonalInfo() {}

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

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public StateOfOrigin getStateOfOrigin() {
        return stateOfOrigin;
    }

    public void setStateOfOrigin(StateOfOrigin stateOfOrigin) {
        this.stateOfOrigin = stateOfOrigin;
    }

    public String getMobilePhone() {
        return mobilePhone;
    }

    public void setMobilePhone(String mobilePhone) {
        this.mobilePhone = mobilePhone;
    }

    public MaritalStatus getMaritalStatus() {
        return maritalStatus;
    }

    public void setMaritalStatus(MaritalStatus maritalStatus) {
        this.maritalStatus = maritalStatus;
    }

    public Integer getNumberOfChildren() {
        return numberOfChildren;
    }

    public void setNumberOfChildren(Integer numberOfChildren) {
        this.numberOfChildren = numberOfChildren;
    }
}
