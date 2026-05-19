package com.handshaker.company_service.repository;

import com.handshaker.company_service.model.FavouriteProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FavouriteProfileRepository
        extends JpaRepository<FavouriteProfile, UUID> {

    List<FavouriteProfile> findByCompanyId(UUID companyId);

    boolean existsByCompanyIdAndProfileId(UUID companyId, UUID profileId);

    void deleteByCompanyIdAndProfileId(UUID companyId, UUID profileId);
}
