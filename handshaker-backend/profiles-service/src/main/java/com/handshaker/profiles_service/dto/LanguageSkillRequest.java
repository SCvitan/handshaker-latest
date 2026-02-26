package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.enums.Language;

public record LanguageSkillRequest(
        Language language,
        Integer written,
        Integer spoken,
        Integer reading,
        Integer understanding
) {}
