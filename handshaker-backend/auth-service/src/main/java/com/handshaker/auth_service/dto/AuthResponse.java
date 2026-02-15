package com.handshaker.auth_service.dto;

import java.util.UUID;

public record AuthResponse(
        UUID id,
        String email,
        String role
) {
}
