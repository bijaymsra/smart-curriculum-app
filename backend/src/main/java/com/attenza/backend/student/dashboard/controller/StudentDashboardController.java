package com.attenza.backend.student.dashboard.controller;

import com.attenza.backend.student.dashboard.dto.StudentDashboardResponse;
import com.attenza.backend.student.dashboard.service.StudentDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/dashboard")
@RequiredArgsConstructor
public class StudentDashboardController {

    private final StudentDashboardService dashboardService;

    @GetMapping
    public ResponseEntity<StudentDashboardResponse> getDashboard(
            Authentication authentication
    ) {

        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }

        Long studentId;

        try {
            studentId = Long.parseLong(authentication.getName());
        } catch (NumberFormatException ex) {
            return ResponseEntity.badRequest().build();
        }

        StudentDashboardResponse response =
                dashboardService.getDashboard(studentId);

        return ResponseEntity.ok(response);
    }
}
