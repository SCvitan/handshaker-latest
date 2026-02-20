package com.handshaker.profiles_service.service;

import com.handshaker.profiles_service.model.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProfileCompletenessCalculator {

    public double calculate(UserProfile profile) {
        double score = 0;

        if (isPersonalComplete(profile)) score += 0.30;
        if (isLegalComplete(profile.getLegalStatus())) score += 0.25;
        if (isJobPreferencesComplete(profile.getJobPreferences())) score += 0.25;
        if (areLanguagesComplete(profile.getLanguageSkills())) score += 0.10;
        if (isAccommodationComplete(profile.getAccommodation())) score += 0.10;

        return round(score);
    }

    private boolean isPersonalComplete(UserProfile profile) {
        PersonalInfo p = profile.getPersonalInfo();
        return p != null
                && notBlank(p.getFirstName())
                && notBlank(p.getLastName())
                && p.getDateOfBirth() != null
                && p.getGender() != null
                && notBlank(p.getMobilePhone());
    }

    private boolean isLegalComplete(LegalStatus l) {
        if (l == null) return false;

        if (l.getDateOfArrivalInCroatia() == null) return false;
        if (l.getPassportExpirationDate() == null) return false;
        if (notBlank(l.getOib()) == false) return false;

        if (l.isHasCroatianWorkPermit()) {
            return l.getWorkPermitExpirationDate() != null;
        }

        return true;
    }

    private boolean isJobPreferencesComplete(JobPreferences j) {
        return j != null
                && notBlank(j.getDesiredIndustry().toString())
                && notBlank(j.getDesiredPosition())
                && j.getExpectedMonthlyIncome() != null
                && j.getDesiredWorkingHoursPerDay() != null
                && j.getDesiredWorkingDaysPerMonth() != null
                && j.getExperienceLevel() != null;
    }

    private boolean areLanguagesComplete(List<LanguageSkill> skills) {
        if (skills == null || skills.isEmpty()) return false;

        return skills.stream().allMatch(s ->
                s.getWritten() > 0 &&
                        s.getSpoken() > 0 &&
                        s.getReading() > 0 &&
                        s.getUnderstanding() > 0
        );
    }

    private boolean isAccommodationComplete(Accommodation a) {
        if (a == null) return false;
        Address addr = a.getAddress();

        return addr != null
                && notBlank(addr.getCity())
                && notBlank(addr.getStreet())
                && notBlank(addr.getPostalCode())
                && notBlank(addr.getHouseNumber())
                && a.getProvider() != null
                && a.getType() != null
                && a.getPeopleInAccommodation() != null
                && a.getPeopleInRoom() != null;
    }

    private boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
