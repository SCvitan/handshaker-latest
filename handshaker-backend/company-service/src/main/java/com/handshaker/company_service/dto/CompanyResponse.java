package com.handshaker.company_service.dto;

import com.handshaker.company_service.enums.CompanySize;
import com.handshaker.company_service.enums.Industry;

import java.util.UUID;

public record CompanyResponse(
         UUID id,
         String email,
         String companyName,
         String description,
         Industry industry,
         String phoneNumber,
         String website,
         String address,
         String city,
         String country,
         CompanySize companySize
) {
}
