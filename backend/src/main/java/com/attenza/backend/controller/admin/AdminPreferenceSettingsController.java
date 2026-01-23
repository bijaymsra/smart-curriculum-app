package com.attenza.backend.controller.admin;

import com.attenza.backend.dto.admin.AdminPreferenceSettingsResponse;
import com.attenza.backend.service.admin.AdminPreferenceSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/preferences")
@RequiredArgsConstructor
public class AdminPreferenceSettingsController {

    private final AdminPreferenceSettingsService service;

    @GetMapping
    public AdminPreferenceSettingsResponse get(@RequestParam Long adminId) {
        return service.get(adminId);
    }

    @PutMapping("/theme")
    public void updateTheme(
            @RequestParam Long adminId,
            @RequestParam String theme
    ) {
        service.updateTheme(adminId, theme);
    }
}
