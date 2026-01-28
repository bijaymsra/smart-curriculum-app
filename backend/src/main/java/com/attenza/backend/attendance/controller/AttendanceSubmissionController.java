package com.attenza.backend.attendance.controller;

import com.attenza.backend.attendance.dto.AttendanceSubmitRequest;
import com.attenza.backend.attendance.dto.AttendanceSubmitResponse;
import com.attenza.backend.attendance.service.AttendanceSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceSubmissionController {

    private final AttendanceSubmissionService submissionService;

    @PostMapping("/submit")
    public ResponseEntity<AttendanceSubmitResponse> submitAttendance(
            @RequestBody AttendanceSubmitRequest request
    ) {
        submissionService.submitAttendance(request);
        return ResponseEntity.ok(
                new AttendanceSubmitResponse("Attendance submitted successfully")
        );
    }
}


