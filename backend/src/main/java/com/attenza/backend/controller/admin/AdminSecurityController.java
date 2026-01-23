package com.attenza.backend.controller.admin;

import com.attenza.backend.dto.admin.ChangePasswordRequest;
import com.attenza.backend.service.admin.AdminSecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/security")
@RequiredArgsConstructor
public class AdminSecurityController {

    private final AdminSecurityService securityService;

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        securityService.changePassword(request);
        return ResponseEntity.ok("Password updated successfully");
    }
}
