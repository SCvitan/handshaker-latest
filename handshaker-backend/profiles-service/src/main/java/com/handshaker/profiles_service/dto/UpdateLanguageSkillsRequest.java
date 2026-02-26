package com.handshaker.profiles_service.dto;

public record UpdateLanguageSkillsRequest(
        Integer croatianWritten,
        Integer croatianSpoken,
        Integer croatianReading,
        Integer croatianUnderstanding,
        Integer englishWritten,
        Integer englishSpoken,
        Integer englishReading,
        Integer englishUnderstanding
) {}
