package com.handshaker.company_service.service;

import com.handshaker.company_service.dto.ProfileSummaryDTO;
import com.handshaker.company_service.model.FavouriteProfile;
import com.handshaker.company_service.repository.FavouriteProfileRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FavouriteProfileService {

    private final FavouriteProfileRepository repository;
    private final ProfileClient profileClient;

    public FavouriteProfileService(FavouriteProfileRepository repository, ProfileClient profileClient) {
        this.repository = repository;
        this.profileClient = profileClient;
    }

    public void addToFavourites(UUID companyId, UUID profileId) {

        if (repository.existsByCompanyIdAndProfileId(companyId, profileId)) {
            return;
        }

        FavouriteProfile fav = new FavouriteProfile();
        fav.setCompanyId(companyId);
        fav.setProfileId(profileId);
        fav.setCreatedAt(LocalDateTime.now());

        repository.save(fav);
    }

    public List<ProfileSummaryDTO> getFavourites(UUID companyId) {

        List<FavouriteProfile> favourites =
                repository.findByCompanyId(companyId);

        List<UUID> profileIds = favourites.stream()
                .map(FavouriteProfile::getProfileId)
                .toList();

        return profileClient.getSummaries(profileIds);
    }

    @Transactional
    public void remove(UUID companyId, UUID profileId) {
        repository.deleteByCompanyIdAndProfileId(companyId, profileId);
    }
}
