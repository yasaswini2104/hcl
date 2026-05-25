package com.bus.booking.auth.repository;
import com.bus.booking.auth.entity.Role;
import com.bus.booking.common.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(RoleType roleType);
}