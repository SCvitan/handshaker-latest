package com.handshaker.profiles_service.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.handshaker.profiles_service.dto.MatchingRequest;
import com.handshaker.profiles_service.model.UserProfile;
import com.handshaker.profiles_service.service.WorkerMatchingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AiMatchingController {

    private final WorkerMatchingService service;
    private static final Logger log = LoggerFactory.getLogger(AiMatchingController.class);


    public AiMatchingController(WorkerMatchingService service) {
        this.service = service;
    }

    @PostMapping("/match-workers")
    public List<UserProfile> match(@RequestBody MatchingRequest request) throws JsonProcessingException {
        log.info("AI endpoint reached");
        return service.match(request.getMessage());
    }
}
