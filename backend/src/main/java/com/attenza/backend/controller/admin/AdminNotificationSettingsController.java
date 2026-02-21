package com.attenza.backend.controller.admin;

import com.attenza.backend.dto.admin.AdminNotificationSettingsRequest;
import com.attenza.backend.entity.AdminNotificationSettings;
import com.attenza.backend.service.admin.AdminNotificationSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminNotificationSettingsController {

    private final AdminNotificationSettingsService service;

    @GetMapping("/notifications")
    public AdminNotificationSettings getSettings(@RequestParam Long adminId) {
        return service.getSettings(adminId);
    }

    @PutMapping("/notifications")
    public void updateSettings(
            @RequestParam Long adminId,
            @RequestBody AdminNotificationSettingsRequest request
    ) {
        service.updateSettings(adminId, request);
    }
}
