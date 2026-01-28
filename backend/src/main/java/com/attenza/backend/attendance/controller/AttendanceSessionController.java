package com.attenza.backend.attendance.controller;

import com.attenza.backend.attendance.dto.AttendanceSessionStartRequest;
import com.attenza.backend.attendance.dto.AttendanceSessionStartResponse;
import com.attenza.backend.attendance.service.AttendanceSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import com.attenza.backend.attendance.service.AttendanceQrTokenService;
import com.attenza.backend.attendance.entity.AttendanceSession;
import com.attenza.backend.attendance.service.AttendanceFinalizationService;



@RestController
@RequestMapping("/api/attendance/session")
@RequiredArgsConstructor
public class AttendanceSessionController {

    private final AttendanceSessionService service;
    private final AttendanceQrTokenService qrTokenService;
    private final AttendanceFinalizationService attendanceFinalizationService;


    @PostMapping("/start")
    public ResponseEntity<AttendanceSessionStartResponse> startSession(
            @RequestBody AttendanceSessionStartRequest request
    ) {
        return ResponseEntity.ok(service.startSession(request));
    }

    @GetMapping("/{sessionId}/stream")
    public SseEmitter streamAttendance(
            @PathVariable String sessionId
    ) {
        return service.registerEmitter(sessionId);
    }

    @PostMapping("/{sessionId}/complete")
    public ResponseEntity<Void> completeSession(@PathVariable String sessionId) {
        service.completeSession(sessionId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{sessionId}/cancel")
    public ResponseEntity<Void> cancelSession(@PathVariable String sessionId) {
        service.cancelSession(sessionId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{sessionId}/qr-token")
    public ResponseEntity<String> getQrToken(@PathVariable String sessionId) {

        AttendanceSession session = service.getActiveSession(sessionId);

        String token = qrTokenService.generateToken(
                session.getSessionId(),
                session.getClassId()
        );

        return ResponseEntity.ok(token);
    }

    @PostMapping("/session/{sessionId}/finalize")
    public ResponseEntity<?> finalizeAttendance(@PathVariable String sessionId) {
        attendanceFinalizationService.finalizeSession(sessionId);
        return ResponseEntity.ok().build();
    }

}

