package com.attenza.backend.repository.admin;

import com.attenza.backend.entity.AdminNotificationSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminNotificationSettingsRepository
        extends JpaRepository<AdminNotificationSettings, Long> {

    Optional<AdminNotificationSettings> findByAdminId(Long adminId);
}
