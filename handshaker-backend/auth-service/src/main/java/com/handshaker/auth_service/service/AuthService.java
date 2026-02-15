package com.handshaker.auth_service.service;

import com.handshaker.auth_service.config.RabbitConfig;
import com.handshaker.auth_service.dto.AuthResponse;
import com.handshaker.auth_service.dto.LoginRequest;
import com.handshaker.auth_service.dto.RegisterRequest;
import com.handshaker.auth_service.model.User;
import com.handshaker.auth_service.repository.UserRepository;
import com.handshaker.auth_service.security.JwtUtil;
import com.handshaker.events.UserRegisteredEvent;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RabbitTemplate rabbitTemplate;
    private final JwtUtil jwtUtil;
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);


    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, RabbitTemplate rabbitTemplate, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.rabbitTemplate = rabbitTemplate;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletResponse response) {
        log.info("Received RegisterRequest");
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalStateException(
                    "Email " + request.email() + " already in use"
            );
        }

        User user = new User(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.role()
        );



        userRepository.saveAndFlush(user);
        log.info("Saved user {}", user.getEmail());

        String token = jwtUtil.generateToken(user.getId(), user.getRole());
        addJwtCookie(response, token);

        UserRegisteredEvent event = new UserRegisteredEvent(
                user.getId(),
                user.getEmail(),
                user.getRole()
        );

        rabbitTemplate.convertAndSend(
                "user.events",
                "user.registered",
                event
        );

        log.info("Sent event to rabbit {}", event.getEmail());

        return new AuthResponse(user.getId(), user.getEmail(), user.getRole());
    }

    public AuthResponse login(LoginRequest loginRequest, HttpServletResponse response) {

        User user = userRepository.findByEmail(loginRequest.email())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Unable to find user with email: " + loginRequest.email()
                        )
                );

        if (!passwordEncoder.matches(loginRequest.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getRole());
        addJwtCookie(response, token);

        return new AuthResponse(user.getId(), user.getEmail(), user.getRole());
    }

    public void logout(HttpServletResponse response){
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void addJwtCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false) // set true in prod
                .path("/")
                .maxAge(60 * 60)
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
