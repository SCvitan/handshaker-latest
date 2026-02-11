package com.handshaker.profiles_service.dto;

public record UpdateLanguageSkillsRequest(
        int croatianWritten,
        int croatianSpoken,
        int croatianReading,
        int croatianUnderstanding,
        int englishWritten,
        int englishSpoken,
        int englishReading,
        int englishUnderstanding
) {}
