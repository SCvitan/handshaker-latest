package com.handshaker.auth_service.controller;

import com.handshaker.auth_service.dto.AuthResponse;
import com.handshaker.auth_service.dto.LoginRequest;
import com.handshaker.auth_service.dto.RegisterRequest;
import com.handshaker.auth_service.model.User;
import com.handshaker.auth_service.service.AuthService;
import com.handshaker.auth_service.security.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
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

}
