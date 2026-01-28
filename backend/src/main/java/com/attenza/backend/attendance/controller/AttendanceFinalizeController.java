package com.attenza.backend.attendance.controller;

import com.attenza.backend.attendance.service.AttendanceFinalizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * =========================================
 * ATTENDANCE FINALIZATION CONTROLLER
 * =========================================
 * Locks an attendance session permanently.
 * No QR scans, reviews, or changes allowed after this.
 */
@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceFinalizeController {

    private final AttendanceFinalizationService finalizeService;

    /**
     * FINALIZE attendance session
     * Called when faculty clicks "Submit Attendance"
     */
    @PostMapping("/session/{sessionId}/finalize")
    public void finalizeSession(@PathVariable String sessionId) {
        finalizeService.finalizeSession(sessionId);
    }
}
