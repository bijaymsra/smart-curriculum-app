package com.attenza.backend.service.admin;

import com.attenza.backend.dto.admin.AdminNotificationSettingsRequest;
import com.attenza.backend.entity.AdminNotificationSettings;
import com.attenza.backend.entity.AdminUser;
import com.attenza.backend.repository.admin.AdminNotificationSettingsRepository;
import com.attenza.backend.repository.admin.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminNotificationSettingsService {

    private final AdminNotificationSettingsRepository settingsRepo;
    private final AdminUserRepository adminRepo;

    public AdminNotificationSettings getSettings(Long adminId) {
        return settingsRepo.findByAdminId(adminId)
                .orElseGet(() -> {
                    AdminUser admin = adminRepo.findById(adminId).orElseThrow();
                    AdminNotificationSettings settings = new AdminNotificationSettings();
                    settings.setAdmin(admin);
                    return settingsRepo.save(settings);
                });
    }

    public void updateSettings(Long adminId, AdminNotificationSettingsRequest req) {
        AdminNotificationSettings settings = getSettings(adminId);

        settings.setEmailNotifications(req.isEmailNotifications());
        settings.setPushNotifications(req.isPushNotifications());
        settings.setAttendanceAlerts(req.isAttendanceAlerts());
        settings.setSystemUpdates(req.isSystemUpdates());
        settings.setWeeklyReports(req.isWeeklyReports());

        settingsRepo.save(settings);
    }
}
