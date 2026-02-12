package com.attenza.backend.attendance.controller;

import com.attenza.backend.attendance.dto.AttendanceSubmitRequest;
import com.attenza.backend.attendance.dto.AttendanceSubmitResponse;
import com.attenza.backend.attendance.entity.AttendanceSubmissionStatus;
import com.attenza.backend.attendance.service.AttendanceSubmissionService;
import jakarta.validation.Valid;
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
            @Valid @RequestBody AttendanceSubmitRequest request
    ) {

        submissionService.submitAttendance(request);

        return ResponseEntity.ok(
                AttendanceSubmitResponse.builder()
                        .message("Attendance submitted successfully")
                        .sessionId("EXTRACT_FROM_TOKEN_IF_NEEDED")
                        .studentId(request.getStudentId())
                        .status(AttendanceSubmissionStatus.PENDING.name())
                        .build()
        );
    }
}
