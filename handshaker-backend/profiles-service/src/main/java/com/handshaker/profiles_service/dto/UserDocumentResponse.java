package com.handshaker.profiles_service.dto;

import com.handshaker.profiles_service.enums.DocumentType;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserDocumentResponse(
        UUID id,
        DocumentType documentType,
        String fileUrl,
        String thumbnailUrl,
        String fileName,
        String contentType,
        boolean previewAvailable,
        LocalDateTime uploadedAt
) {}
