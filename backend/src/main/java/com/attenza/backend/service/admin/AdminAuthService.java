package com.attenza.backend.service.admin;

import com.attenza.backend.dto.admin.AdminLoginRequest;
import com.attenza.backend.dto.admin.AdminLoginResponse;
import com.attenza.backend.entity.AdminStatus;
import com.attenza.backend.entity.AdminUser;
import com.attenza.backend.entity.UserRole;
import com.attenza.backend.exception.BadRequestException;
import com.attenza.backend.repository.admin.AdminUserRepository;
import com.attenza.backend.security.JwtTokenService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AdminUserRepository adminRepo;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;   

    public AdminLoginResponse login(AdminLoginRequest request) {

        AdminUser admin = adminRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        // 🔒 Password check
        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        // 🔒 Role enforced SERVER-SIDE
        if (admin.getRole() != UserRole.ADMIN) {
            throw new BadRequestException("Access denied");
        }

        // 🔒 Approval check
        if (admin.getStatus() != AdminStatus.APPROVED) {
            throw new BadRequestException("Your account is " + admin.getStatus());
        }

        // ✅ Generate JWT Token
        String token = jwtTokenService.generateToken(
                admin.getId().toString(),   // subject
                "ADMIN"                     // role
        );

        // ✅ Return response WITH token (without breaking existing structure)
        return new AdminLoginResponse(
                token,                             
                admin.getId(),
                admin.getEmail(),
                admin.getFullName(),
                admin.getInstitution().getName(),
                admin.getStatus().name(),
                admin.getInstitution().getId()
        );
    }
}
