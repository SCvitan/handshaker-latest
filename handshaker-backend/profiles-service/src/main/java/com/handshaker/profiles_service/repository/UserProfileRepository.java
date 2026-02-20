package com.handshaker.profiles_service.repository;

import com.handshaker.profiles_service.model.UserProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface UserProfileRepository extends JpaRepository<UserProfile, UUID>, JpaSpecificationExecutor<UserProfile> {

    boolean existsByEmail(String email);

    @EntityGraph(attributePaths = {"languageSkills"})
    Page<UserProfile> findAll(Specification<UserProfile> spec, Pageable pageable);

}
