package com.attenza.backend.repository.admin;

import com.attenza.backend.entity.AdminPreferenceSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminPreferenceSettingsRepository
        extends JpaRepository<AdminPreferenceSettings, Long> {

    Optional<AdminPreferenceSettings> findByAdminId(Long adminId);
}
