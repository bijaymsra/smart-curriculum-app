// package com.attenza.backend.repository.admin;

// import com.attenza.backend.entity.AdminUser;
// import com.attenza.backend.entity.UserRole; 
// import org.springframework.data.jpa.repository.JpaRepository;

// import java.util.Optional;

// public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {

//     Optional<AdminUser> findByEmailAndRole(String email, UserRole role);

//     boolean existsByEmail(String email);
// }


package com.attenza.backend.repository.admin;

import com.attenza.backend.entity.AdminUser;
import com.attenza.backend.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {

    Optional<AdminUser> findByEmail(String email);
    boolean existsByEmail(String email);

    Optional<AdminUser> findByEmailAndRole(String email, UserRole role);
}
