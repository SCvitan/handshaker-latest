package com.handshaker.auth_service.controller;

import com.handshaker.auth_service.dto.LoginRequest;
import com.handshaker.auth_service.dto.RegisterRequest;
import com.handshaker.auth_service.model.User;
import com.handshaker.auth_service.service.AuthService;
import com.handshaker.auth_service.security.JwtUtil;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody RegisterRequest registerRequest){
        User user = authService.register(registerRequest);
        String token = jwtUtil.generateToken(user.getId(), user.getRole());
        return Map.of("token", token);
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest loginRequest){
        User user = authService.login(
                loginRequest.email(),
                loginRequest.password()
        );

        String token = jwtUtil.generateToken(user.getId(), user.getRole());
        return Map.of("token", token);
    }

    @GetMapping("/validate")
    public Map<String, String> validate(@RequestHeader("Authorization") String header) {
        String token = header.replace("Bearer ", "");
        return Map.of("userId", jwtUtil.validateAndGetUserId(token).toString());
    }
}
