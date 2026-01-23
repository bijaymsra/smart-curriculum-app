package com.attenza.backend.controller.admin;

import com.attenza.backend.dto.admin.AdminProfileResponse;
import com.attenza.backend.service.admin.AdminProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminProfileController {

    private final AdminProfileService adminProfileService;

    @GetMapping("/me")
    public AdminProfileResponse getMyProfile(@RequestParam Long adminId) {
        return adminProfileService.getAdminProfile(adminId);
    }
}
