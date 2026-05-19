package com.handshaker.profiles_service.repository;

import com.handshaker.profiles_service.dto.AccessResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(
        name = "company-service",
        url = "${company.service.url}",
        contextId = "companyClient"
)
public interface CompanyClient {

    @GetMapping("/api/internal/company/access/{companyId}")
    AccessResponse getAccess(@PathVariable UUID companyId);
}

