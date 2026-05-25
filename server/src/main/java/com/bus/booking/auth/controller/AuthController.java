package com.bus.booking.auth.controller;

import com.bus.booking.auth.dto.request.LoginRequest;
import com.bus.booking.auth.dto.request.RegisterRequest;
import com.bus.booking.auth.dto.response.AuthResponse;
import com.bus.booking.auth.service.AuthService;
import com.bus.booking.common.response.ApiResponse;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * REGISTER USER
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>>
    registerUser(
            @Valid @RequestBody RegisterRequest request
    ) {

        AuthResponse response =
                authService.register(request);

        return ResponseEntity.ok(
                ApiResponse.<AuthResponse>builder()
                        .success(true)
                        .message("User registered successfully")
                        .data(response)
                        .build()
        );
    }

    /**
     * LOGIN USER
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>>
    loginUser(
            @Valid @RequestBody LoginRequest request
    ) {

        AuthResponse response =
                authService.login(request);

        return ResponseEntity.ok(
                ApiResponse.<AuthResponse>builder()
                        .success(true)
                        .message("Login successful")
                        .data(response)
                        .build()
        );
    }

    /**
     * TEST SECURED API
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<String>>
    currentUser() {

        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message("Authorized user")
                        .data("JWT token is valid")
                        .build()
        );
    }
}