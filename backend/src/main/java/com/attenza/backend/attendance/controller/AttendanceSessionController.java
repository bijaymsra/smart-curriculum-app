package com.attenza.backend.attendance.controller;

import com.attenza.backend.attendance.dto.AttendanceSessionStartRequest;
import com.attenza.backend.attendance.dto.AttendanceSessionStartResponse;
import com.attenza.backend.attendance.service.AttendanceSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance/session")
@RequiredArgsConstructor
public class AttendanceSessionController {

    private final AttendanceSessionService service;

    @PostMapping("/start")
    public ResponseEntity<AttendanceSessionStartResponse> startSession(
            @RequestBody AttendanceSessionStartRequest request
    ) {
        return ResponseEntity.ok(service.startSession(request));
    }
}
