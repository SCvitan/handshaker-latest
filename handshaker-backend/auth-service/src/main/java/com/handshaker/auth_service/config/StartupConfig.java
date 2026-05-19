package com.handshaker.auth_service.config;

import com.handshaker.auth_service.model.User;
import com.handshaker.auth_service.repository.UserRepository;
import com.handshaker.events.UserRegisteredEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
public class StartupConfig {

    @Bean
    CommandLineRunner createDefaultUsers(UserRepository userRepository,
                                         PasswordEncoder passwordEncoder,
                                         RabbitTemplate rabbitTemplate) {
        return args -> {

            try {
                // Wait for RabbitMQ & profiles-service to start
                Thread.sleep(15000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }

            createUser(
                    "worker@test.com",
                    "password",
                    "USER",
                    userRepository,
                    passwordEncoder,
                    rabbitTemplate
            );

            createUser(
                    "company@test.com",
                    "password",
                    "COMPANY",
                    userRepository,
                    passwordEncoder,
                    rabbitTemplate
            );

        };
    }

    private void createUser(String email,
                            String password,
                            String role,
                            UserRepository userRepository,
                            PasswordEncoder passwordEncoder,
                            RabbitTemplate rabbitTemplate) {

        if (userRepository.existsByEmail(email)) {
            System.out.println("User already exists: " + email);
            return;
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setEmailVerified(true);

        userRepository.save(user);

        // Send event to profiles-service
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

        System.out.println("✅ Created " + role + " user: " + email);
    }
}