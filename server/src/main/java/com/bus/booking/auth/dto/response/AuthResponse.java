package com.bus.booking.auth.dto.response;

import lombok.*;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String message;
    private String email;
    private String fullName;
    private List<String> roles;
}