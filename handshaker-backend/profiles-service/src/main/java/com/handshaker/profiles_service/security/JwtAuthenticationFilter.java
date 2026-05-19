package com.handshaker.profiles_service.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    // internal service header
    private static final String INTERNAL_HEADER = "X-Internal-Service";
    private static final String INTERNAL_SERVICE_NAME = "company-service";

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        // -------------------------------------------------
        // 1. Allow public/internal bypass BEFORE JWT check
        // -------------------------------------------------
        if (isInternalCall(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        if (isPublicPath(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        // -------------------------------------------------
        // 2. Extract JWT (from cookie)
        // -------------------------------------------------
        String token = extractJwtFromCookie(request);

        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // -------------------------------------------------
            // 3. Validate token
            // -------------------------------------------------
            Claims claims = tokenProvider.validateToken(token);

            UUID userId = tokenProvider.getUserId(claims);
            String role = tokenProvider.getRole(claims);

            // -------------------------------------------------
            // 4. Create Authentication object
            // -------------------------------------------------
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userId,
                            null,
                            List.of(() -> "ROLE_" + role)
                    );

            authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            log.warn("Invalid JWT: {}", e.getMessage());

            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid or expired JWT"
            );
            return;
        }

        filterChain.doFilter(request, response);
    }

    // -------------------------------------------------
    // INTERNAL SERVICE CHECK
    // -------------------------------------------------
    private boolean isInternalCall(HttpServletRequest request) {
        String internalHeader = request.getHeader(INTERNAL_HEADER);
        return INTERNAL_SERVICE_NAME.equals(internalHeader);
    }

    // -------------------------------------------------
    // PUBLIC PATHS (optional extend later)
    // -------------------------------------------------
    private boolean isPublicPath(String path) {
        return path.startsWith("/api/ai")
                || path.startsWith("/actuator")
                || path.startsWith("/swagger")
                || path.startsWith("/v3/api-docs");
    }

    // -------------------------------------------------
    // JWT EXTRACTION FROM COOKIE
    // -------------------------------------------------
    private String extractJwtFromCookie(HttpServletRequest request) {

        if (request.getCookies() == null) {
            return null;
        }

        for (Cookie cookie : request.getCookies()) {
            if ("jwt".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }
}