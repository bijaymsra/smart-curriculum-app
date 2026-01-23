package com.attenza.backend.service.admin;

import com.attenza.backend.dto.admin.AdminPreferenceSettingsResponse;
import com.attenza.backend.entity.AdminPreferenceSettings;
import com.attenza.backend.entity.AdminUser;
import com.attenza.backend.repository.admin.AdminPreferenceSettingsRepository;
import com.attenza.backend.repository.admin.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminPreferenceSettingsService {

    private final AdminPreferenceSettingsRepository prefRepo;
    private final AdminUserRepository adminRepo;

    public AdminPreferenceSettingsResponse get(Long adminId) {
        AdminPreferenceSettings settings = prefRepo
                .findByAdminId(adminId)
                .orElseGet(() -> createDefault(adminId));

        AdminPreferenceSettingsResponse res = new AdminPreferenceSettingsResponse();
        res.setTheme(settings.getTheme());
        res.setLanguage(settings.getLanguage());
        res.setTimezone(settings.getTimezone());
        return res;
    }

    public void updateTheme(Long adminId, String theme) {
        AdminPreferenceSettings settings = prefRepo
                .findByAdminId(adminId)
                .orElseGet(() -> createDefault(adminId));

        settings.setTheme(theme);
        prefRepo.save(settings);
    }

    private AdminPreferenceSettings createDefault(Long adminId) {
        AdminUser admin = adminRepo.findById(adminId)
                .orElseThrow();

        AdminPreferenceSettings settings = new AdminPreferenceSettings();
        settings.setAdmin(admin);
        return prefRepo.save(settings);
    }
}
