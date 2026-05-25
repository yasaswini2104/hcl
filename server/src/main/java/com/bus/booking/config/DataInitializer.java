package com.bus.booking.config;

import com.bus.booking.auth.entity.Role;
import com.bus.booking.auth.repository.RoleRepository;
import com.bus.booking.common.enums.RoleType;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer
        implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {

        if (roleRepository
                .findByRoleName(RoleType.ROLE_USER)
                .isEmpty()) {

            roleRepository.save(
                    Role.builder()
                            .roleName(RoleType.ROLE_USER)
                            .build()
            );
        }

        if (roleRepository
                .findByRoleName(RoleType.ROLE_ADMIN)
                .isEmpty()) {

            roleRepository.save(
                    Role.builder()
                            .roleName(RoleType.ROLE_ADMIN)
                            .build()
            );
        }
    }
}