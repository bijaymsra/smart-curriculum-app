package com.attenza.backend.controller.admin;

import com.attenza.backend.service.admin.AdminAttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/attendance")
@RequiredArgsConstructor
public class AdminAttendanceController {

    private final AdminAttendanceService adminAttendanceService;

    @GetMapping("/overview")
    public ResponseEntity<?> getOverview() {
        return ResponseEntity.ok(adminAttendanceService.getOverviewStats());
    }

    @GetMapping("/sessions")
    public ResponseEntity<?> getSessions(
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(adminAttendanceService.getSessions(status));
    }

    @GetMapping("/reviews")
    public ResponseEntity<?> getReviews(
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(adminAttendanceService.getSubmissionsForReview(status));
    }
}
