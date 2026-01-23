package com.attenza.backend.controller.admin;

import com.attenza.backend.entity.AdminStatus;
import com.attenza.backend.service.admin.AdminApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin-approval")
@RequiredArgsConstructor
public class AdminApprovalController {

    private final AdminApprovalService approvalService;

    @PutMapping("/{adminId}")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long adminId,
            @RequestParam AdminStatus status
    ) {
        approvalService.updateAdminStatus(adminId, status);
        return ResponseEntity.ok("Admin status updated to " + status);
    }
}
