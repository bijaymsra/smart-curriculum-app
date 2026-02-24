package com.attenza.backend.service.admin;

import com.attenza.backend.dto.admin.ChangePasswordRequest;
import com.attenza.backend.entity.AdminUser;
import com.attenza.backend.exception.BadRequestException;
import com.attenza.backend.repository.admin.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminSecurityService {

    private final AdminUserRepository adminRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    public void changePassword(ChangePasswordRequest request) {

        AdminUser admin = adminRepo.findById(request.getAdminId())
                .orElseThrow(() -> new BadRequestException("Admin not found"));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), admin.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        // Validate new password
        if (request.getNewPassword().length() < 8) {
            throw new BadRequestException("New password must be at least 8 characters");
        }

        // Update password
        admin.setPassword(passwordEncoder.encode(request.getNewPassword()));
        adminRepo.save(admin);
    }
}
