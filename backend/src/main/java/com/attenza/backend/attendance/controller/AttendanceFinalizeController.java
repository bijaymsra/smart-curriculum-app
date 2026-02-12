package com.attenza.backend.attendance.controller;

import com.attenza.backend.attendance.entity.AttendanceSessionStatus;
import com.attenza.backend.attendance.service.AttendanceFinalizationService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceFinalizeController {

    private final AttendanceFinalizationService finalizeService;

    @PostMapping("/session/{sessionId}/finalize")
    public ResponseEntity<FinalizeResponse> finalizeSession(
            @PathVariable String sessionId
    ) {

        finalizeService.finalizeSession(sessionId);

        return ResponseEntity.ok(
                new FinalizeResponse(
                        "Attendance finalized successfully",
                        sessionId,
                        AttendanceSessionStatus.FINALIZED.name()
                )
        );
    }

    @Data
    @AllArgsConstructor
    private static class FinalizeResponse {
        private String message;
        private String sessionId;
        private String status;
    }
}
