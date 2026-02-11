package com.handshaker.auth_service.dto;

public record RegisterRequest(
        String email,
        String password,
        String role
) {
}
