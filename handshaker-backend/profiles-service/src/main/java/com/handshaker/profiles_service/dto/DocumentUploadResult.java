package com.handshaker.profiles_service.dto;

public record DocumentUploadResult(
        String fileUrl,
        String thumbnailUrl,
        boolean previewAvailable
) {}
