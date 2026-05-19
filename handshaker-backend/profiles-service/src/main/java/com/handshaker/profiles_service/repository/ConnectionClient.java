package com.handshaker.profiles_service.repository;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@FeignClient(name = "company-service", contextId = "connectionClient", url = "${company.service.url}")
public interface ConnectionClient {

    @GetMapping("/api/internal/company/connections/exists")
    boolean exists(
            @RequestParam UUID companyId,
            @RequestParam UUID workerId
    );
}
