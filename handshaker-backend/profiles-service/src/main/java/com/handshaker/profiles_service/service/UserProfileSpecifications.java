package com.handshaker.profiles_service.service;

import com.handshaker.profiles_service.dto.UserProfileSearchRequest;
import com.handshaker.profiles_service.model.*;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class UserProfileSpecifications {

    public static Specification<UserProfile> build(UserProfileSearchRequest request) {

        return (root, query, cb) -> {

            query.distinct(true);

            List<Predicate> predicates = new ArrayList<>();

            // JOINs
            Join<UserProfile, PersonalInfo> personal =
                    root.join("personalInfo", JoinType.LEFT);

            Join<UserProfile, LegalStatus> legal =
                    root.join("legalStatus", JoinType.LEFT);

            Join<UserProfile, JobPreferences> job =
                    root.join("jobPreferences", JoinType.LEFT);

            Join<UserProfile, EmploymentCurrent> employment =
                    root.join("employmentCurrent", JoinType.LEFT);

            Join<UserProfile, Accommodation> accommodation =
                    root.join("accommodation", JoinType.LEFT);

            // 🔎 SEARCH (first + last name)
            if (request.getSearch() != null && !request.getSearch().isBlank()) {
                String pattern = "%" + request.getSearch().toLowerCase() + "%";

                predicates.add(
                        cb.or(
                                cb.like(cb.lower(personal.get("firstName")), pattern),
                                cb.like(cb.lower(personal.get("lastName")), pattern)
                        )
                );
            }

            // Gender
            if (request.getGender() != null) {
                predicates.add(cb.equal(personal.get("gender"), request.getGender()));
            }

            // Marital Status
            if (request.getMaritalStatus() != null) {
                predicates.add(cb.equal(
                        personal.get("maritalStatus"),   // Expression<MaritalStatus>
                        request.getMaritalStatus()       // MaritalStatus ✅
                ));
            }

            // State of origin
            if (request.getStateOfOrigin() != null && !request.getStateOfOrigin().isBlank()) {
                predicates.add(cb.equal(
                        personal.get("stateOfOrigin"),   // Expression<String>
                        request.getStateOfOrigin()       // String ✅
                ));
            }

            // Age (calculate from dateOfBirth)
            if (request.getMinAge() != null) {
                LocalDate maxBirthDate = LocalDate.now().minusYears(request.getMinAge());
                predicates.add(cb.lessThanOrEqualTo(personal.get("dateOfBirth"), maxBirthDate));
            }

            if (request.getMaxAge() != null) {
                LocalDate minBirthDate = LocalDate.now().minusYears(request.getMaxAge());
                predicates.add(cb.greaterThanOrEqualTo(personal.get("dateOfBirth"), minBirthDate));
            }

            // Work permit
            if (request.getHasWorkPermit() != null) {
                predicates.add(cb.equal(
                        legal.get("hasCroatianWorkPermit"),
                        request.getHasWorkPermit()
                ));
            }

            if (request.getCurrentlyEmployed() != null) {
                predicates.add(cb.equal(
                        legal.get("currentlyEmployedInCroatia"),
                        request.getCurrentlyEmployed()
                ));
            }

            // Industry + Position (from current employment)
            if (request.getIndustry() != null) {
                predicates.add(cb.equal(employment.get("industry"), request.getIndustry()));
            }

            if (request.getPosition() != null) {
                predicates.add(cb.equal(employment.get("jobTitleInCroatia"), request.getPosition()));
            }

            // Experience
            if (request.getMinExperienceYears() != null) {
                predicates.add(cb.greaterThanOrEqualTo(
                        job.get("yearsOfExperience"),
                        request.getMinExperienceYears()
                ));
            }

            if (request.getMaxExperienceYears() != null) {
                predicates.add(cb.lessThanOrEqualTo(
                        job.get("yearsOfExperience"),
                        request.getMaxExperienceYears()
                ));
            }

            if (request.getExperienceLevel() != null) {
                predicates.add(cb.equal(
                        job.get("experienceLevel"),
                        request.getExperienceLevel()
                ));
            }

            // Income
            if (request.getMinIncome() != null) {
                predicates.add(cb.greaterThanOrEqualTo(
                        job.get("expectedMonthlyIncome"),
                        request.getMinIncome()
                ));
            }

            if (request.getMaxIncome() != null) {
                predicates.add(cb.lessThanOrEqualTo(
                        job.get("expectedMonthlyIncome"),
                        request.getMaxIncome()
                ));
            }

            // Accommodation / Transportation required
            if (request.getAccommodationRequired() != null) {
                predicates.add(cb.equal(
                        job.get("accommodationRequired"),
                        request.getAccommodationRequired()
                ));
            }

            if (request.getTransportationRequired() != null) {
                predicates.add(cb.equal(
                        job.get("transportationRequired"),
                        request.getTransportationRequired()
                ));
            }

            // City (from work address)
            if (request.getCity() != null) {
                predicates.add(cb.equal(
                        employment.get("workAddress").get("city"),
                        request.getCity()
                ));
            }

            if (request.getLanguage() != null) {

                Join<UserProfile, LanguageSkill> languageJoin =
                        root.join("languageSkills", JoinType.INNER);

                predicates.add(cb.equal(
                        languageJoin.get("language"),
                        request.getLanguage()
                ));

                if (request.getMinProficiency() != null) {

                    Expression<Number> avg =
                            cb.quot(
                                    cb.sum(
                                            cb.sum(languageJoin.get("written"), languageJoin.get("spoken")),
                                            cb.sum(languageJoin.get("reading"), languageJoin.get("understanding"))
                                    ),
                                    4
                            );

                    predicates.add(
                            cb.ge(avg, request.getMinProficiency())
                    );
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));

        };
    }}
