package com.bus.booking.auth.service;
import com.bus.booking.auth.dto.request.LoginRequest;
import com.bus.booking.auth.dto.request.RegisterRequest;
import com.bus.booking.auth.dto.response.AuthResponse;
import com.bus.booking.auth.entity.Role;
import com.bus.booking.auth.entity.User;
import com.bus.booking.auth.repository.RoleRepository;
import com.bus.booking.auth.repository.UserRepository;
import com.bus.booking.common.enums.RoleType;
import com.bus.booking.security.jwt.JwtUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {

        log.info("Register request received for email: {}",
                request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {

            log.error("Email already exists: {}",
                    request.getEmail());

            throw new RuntimeException(
                    "Email already registered"
            );
        }
        Role userRole = roleRepository
                .findByRoleName(RoleType.ROLE_USER)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Default role not found"
                        ));

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .roles(roles)
                .isActive(true)
                .build();

        userRepository.save(user);

        log.info("User registered successfully: {}",
                user.getEmail());
        String token =
                jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .message("Registration successful")
                .build();
    }

    public AuthResponse login(LoginRequest request) {

        log.info("Login request received for email: {}",
                request.getEmail());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        String token =
                jwtUtil.generateToken(user.getEmail());

        log.info("Login successful for user: {}",
                user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .message("Login successful")
                .build();
    }
}