package com.handshaker.profiles_service.service;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.UUID;


@Component
public class AuthUtil {

    public UUID getCompanyId(Authentication authentication) {

        return UUID.fromString(authentication.getPrincipal().toString());
    }
}
