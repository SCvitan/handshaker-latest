package com.handshaker.profiles_service.repository;

import com.handshaker.profiles_service.enums.Language;
import com.handshaker.profiles_service.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface UserProfileRepository extends JpaRepository<UserProfile, UUID>, JpaSpecificationExecutor<UserProfile> {

    boolean existsByEmail(String email);

    @Query("""
SELECT DISTINCT u
FROM UserProfile u
JOIN u.workExperiences we
JOIN u.jobPreferences jp
JOIN u.languageSkills ls
WHERE (:position IS NULL OR LOWER(we.position) LIKE LOWER(CONCAT('%', :position, '%')))
AND (:experience IS NULL OR jp.yearsOfExperience >= :experience)
AND (:language IS NULL OR ls.language = :language)
""")
    List<UserProfile> findMatchingWorkers(
            String position,
            Integer experience,
            Language language
    );

}
