package com.handshaker.company_service.dto;

import com.handshaker.company_service.enums.CompanySize;
import com.handshaker.company_service.enums.Industry;


public record UpdateCompanyRequest(
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
