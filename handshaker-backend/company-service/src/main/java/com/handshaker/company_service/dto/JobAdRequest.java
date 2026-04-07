package com.handshaker.company_service.dto;

import com.handshaker.company_service.enums.SalaryType;
import com.handshaker.company_service.enums.WorkType;

public class JobAdRequest {

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

    public JobAdRequest(String industry, String position, String description, Location location, WorkType workType, SalaryType salaryType, Double salaryAmount, Integer workingHoursPerDay, Integer workingDaysPerMonth, Boolean accommodationProvided, Boolean transportationProvided) {
        this.industry = industry;
        this.position = position;
        this.description = description;
        this.location = location;
        this.workType = workType;
        this.salaryType = salaryType;
        this.salaryAmount = salaryAmount;
        this.workingHoursPerDay = workingHoursPerDay;
        this.workingDaysPerMonth = workingDaysPerMonth;
        this.accommodationProvided = accommodationProvided;
        this.transportationProvided = transportationProvided;
    }

    public static class Location {

        private String street;
        private String streetNumber;
        private String city;
        private String postalCode;
        private String country;

        public String getStreet() {
            return street;
        }

        public void setStreet(String street) {
            this.street = street;
        }

        public String getStreetNumber() {
            return streetNumber;
        }

        public void setStreetNumber(String streetNumber) {
            this.streetNumber = streetNumber;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getPostalCode() {
            return postalCode;
        }

        public void setPostalCode(String postalCode) {
            this.postalCode = postalCode;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }
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
}
