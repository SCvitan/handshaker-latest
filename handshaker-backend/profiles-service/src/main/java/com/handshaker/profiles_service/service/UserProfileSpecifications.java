package com.handshaker.profiles_service.service;

import com.handshaker.profiles_service.dto.UserSearchRequest;
import com.handshaker.profiles_service.model.JobPreferences;
import com.handshaker.profiles_service.model.LanguageSkill;
import com.handshaker.profiles_service.model.LegalStatus;
import com.handshaker.profiles_service.model.UserProfile;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class UserProfileSpecifications {

    public static Specification<UserProfile> withFilters(
            UserSearchRequest req,
            ProfileCompletenessCalculator calculator
    ) {
        return (root, query, cb) -> {

            query.distinct(true);

            Join<UserProfile, JobPreferences> job = root.join("jobPreferences", JoinType.LEFT);
            Join<UserProfile, LegalStatus> legal = root.join("legalStatus", JoinType.LEFT);
            Join<UserProfile, LanguageSkill> lang = root.join("languageSkills", JoinType.LEFT);

                List<Predicate> predicates = new ArrayList<>();

            if (req.industry() != null) {
                predicates.add(cb.equal(job.get("desiredIndustry"), req.industry()));
            }

            if (req.position() != null) {
                predicates.add(cb.equal(job.get("desiredPosition"), req.position()));
            }

            if (req.experienceLevel() != null) {
                predicates.add(cb.equal(job.get("experienceLevel"), req.experienceLevel()));
            }

            if (req.minYearsOfExperience() != null) {
                predicates.add(cb.ge(job.get("yearsOfExperience"), req.minYearsOfExperience()));
            }

            if (req.maxYearsOfExperience() != null) {
                predicates.add(cb.le(job.get("yearsOfExperience"), req.maxYearsOfExperience()));
            }

            if (req.minExpectedIncome() != null) {
                predicates.add(cb.ge(job.get("expectedMonthlyIncome"), req.minExpectedIncome()));
            }

            if (req.maxExpectedIncome() != null) {
                predicates.add(cb.le(job.get("expectedMonthlyIncome"), req.maxExpectedIncome()));
            }

            if (req.hasWorkPermit() != null) {
                predicates.add(cb.equal(legal.get("hasCroatianWorkPermit"), req.hasWorkPermit()));
            }

            if (req.currentlyEmployed() != null) {
                predicates.add(cb.equal(legal.get("currentlyEmployedInCroatia"), req.currentlyEmployed()));
            }

            if (req.language() != null && req.minLanguageLevel() != null) {
                predicates.add(cb.equal(lang.get("language"), req.language()));

                Predicate levelPredicate = cb.and(
                        cb.ge(lang.get("written"), req.minLanguageLevel()),
                        cb.ge(lang.get("spoken"), req.minLanguageLevel()),
                        cb.ge(lang.get("reading"), req.minLanguageLevel()),
                        cb.ge(lang.get("understanding"), req.minLanguageLevel())
                );

                predicates.add(levelPredicate);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
