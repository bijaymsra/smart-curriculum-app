package com.attenza.backend.service.admin;

import com.attenza.backend.dto.admin.AdminProfileResponse;
import com.attenza.backend.entity.AdminUser;
import com.attenza.backend.exception.BadRequestException;
import com.attenza.backend.repository.admin.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminProfileService {

    private final AdminUserRepository adminRepo;

    public AdminProfileResponse getAdminProfile(Long adminId) {

        AdminUser admin = adminRepo.findById(adminId)
                .orElseThrow(() -> new BadRequestException("Admin not found"));

        return AdminProfileResponse.from(admin);
    }
}
