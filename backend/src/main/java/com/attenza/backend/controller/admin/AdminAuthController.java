package com.attenza.backend.controller.admin;

import com.attenza.backend.dto.admin.AdminLoginRequest;
import com.attenza.backend.dto.admin.AdminLoginResponse;
import com.attenza.backend.service.admin.AdminAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin-auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(
            @RequestBody AdminLoginRequest request
    ) {
        return ResponseEntity.ok(authService.login(request));
    }
}
