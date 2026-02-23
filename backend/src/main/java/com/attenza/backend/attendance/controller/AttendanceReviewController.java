package com.attenza.backend.attendance.controller;

import com.attenza.backend.attendance.dto.AttendanceReviewRequest;
import com.attenza.backend.attendance.service.AttendanceReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance/review")
@RequiredArgsConstructor
public class AttendanceReviewController {

    private final AttendanceReviewService reviewService;

    @PatchMapping("/{submissionId}")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long submissionId,
            @Valid @RequestBody AttendanceReviewRequest request
    ) {

        reviewService.updateStatus(
                submissionId,
                request.getStatus()
        );

        return ResponseEntity.ok().build();
    }
}
