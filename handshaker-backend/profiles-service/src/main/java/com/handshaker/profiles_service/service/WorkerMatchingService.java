package com.handshaker.profiles_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.handshaker.profiles_service.dto.WorkerMatchingCriteria;
import com.handshaker.profiles_service.enums.Language;
import com.handshaker.profiles_service.model.UserProfile;
import com.handshaker.profiles_service.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkerMatchingService {

    private final AiMatchingService ai;
    private final UserProfileRepository repo;

    public WorkerMatchingService(AiMatchingService ai,
                                 UserProfileRepository repo) {
        this.ai = ai;
        this.repo = repo;
    }

    public List<UserProfile> match(String message) throws JsonProcessingException {

        WorkerMatchingCriteria criteria = ai.extractCriteria(message);

        // ✅ PLACE IT HERE
        Language languageEnum = null;

        if (criteria.getLanguage() != null) {
            languageEnum = Language.valueOf(criteria.getLanguage().toUpperCase());
        }

        return repo.findMatchingWorkers(
                criteria.getPosition(),
                criteria.getMinExperience(),
                languageEnum
        );
    }
}
