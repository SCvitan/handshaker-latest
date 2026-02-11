package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.enums.Language;

public record LanguageSkillResponse(
        Language language,
        int written,
        int spoken,
        int reading,
        int understanding
) {}
