package com.handshaker.company_service.controller;

import com.handshaker.company_service.dto.SubscriptionResponse;
import com.handshaker.company_service.enums.SubscriptionPlan;
import com.handshaker.company_service.service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/subscription")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @PostMapping("/activate")
    public ResponseEntity<SubscriptionResponse> activate(
            @RequestParam SubscriptionPlan plan,
            Authentication authentication
    ) {
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());
        SubscriptionResponse response =
                subscriptionService.activate(userId, plan);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<SubscriptionResponse> getMySubscription(
            Authentication authentication
    ) {
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());
        SubscriptionResponse response =
                subscriptionService.getCurrent(userId);

        return ResponseEntity.ok(response);
    }


}
