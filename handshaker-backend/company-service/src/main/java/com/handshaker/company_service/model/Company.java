package com.handshaker.company_service.model;

import com.handshaker.company_service.enums.CompanySize;
import com.handshaker.company_service.enums.Industry;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;
    private String companyName;
    private String description;
    private Industry industry;
    private String phoneNumber;
    private String website;
    private String address;
    private String city;
    private String country;
    @Enumerated(EnumType.STRING)
    private CompanySize companySize;

    public Company(UUID id, String email, String companyName, String description, Industry industry, String phoneNumber, String website, String address, String city, String country, CompanySize companySize) {
        this.id = id;
        this.email = email;
        this.companyName = companyName;
        this.description = description;
        this.industry = industry;
        this.phoneNumber = phoneNumber;
        this.website = website;
        this.address = address;
        this.city = city;
        this.country = country;
        this.companySize = companySize;
    }

    public Company() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Industry getIndustry() {
        return industry;
    }

    public void setIndustry(Industry industry) {
        this.industry = industry;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public CompanySize getCompanySize() {
        return companySize;
    }

    public void setCompanySize(CompanySize companySize) {
        this.companySize = companySize;
    }
}
