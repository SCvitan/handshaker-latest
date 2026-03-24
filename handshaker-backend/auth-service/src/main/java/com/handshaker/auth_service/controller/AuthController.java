package com.handshaker.auth_service.controller;

import com.handshaker.auth_service.dto.AuthResponse;
import com.handshaker.auth_service.dto.LoginRequest;
import com.handshaker.auth_service.dto.RegisterRequest;
import com.handshaker.auth_service.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.UUID;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest, HttpServletResponse response){
        return ResponseEntity.ok(authService.register(registerRequest, response));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response){
        return ResponseEntity.ok(authService.login(loginRequest, response));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getMe(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(authService.getMe(userId));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String token, HttpServletResponse response) throws IOException {
       authService.verify(token, response);
       return ResponseEntity.ok("Email verified successfully");
    }

}
