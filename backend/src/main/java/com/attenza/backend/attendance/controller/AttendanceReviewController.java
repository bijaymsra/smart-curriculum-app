package com.attenza.backend.attendance.controller;

import com.attenza.backend.attendance.service.AttendanceReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance/review")
@RequiredArgsConstructor
public class AttendanceReviewController {

    private final AttendanceReviewService reviewService;

    /* =========================
       APPROVE
       ========================= */
    @PostMapping("/{submissionId}/approve")
    public ResponseEntity<?> approve(
            @PathVariable Long submissionId
    ) {
        reviewService.approve(submissionId);
        return ResponseEntity.ok().build();
    }

    /* =========================
       REJECT
       ========================= */
    @PostMapping("/{submissionId}/reject")
    public ResponseEntity<?> reject(
            @PathVariable Long submissionId
    ) {
        reviewService.reject(submissionId);
        return ResponseEntity.ok().build();
    }

    /* =========================
       FLAG (optional)
       ========================= */
    @PostMapping("/{submissionId}/flag")
    public ResponseEntity<?> flag(
            @PathVariable Long submissionId
    ) {
        reviewService.flag(submissionId);
        return ResponseEntity.ok().build();
    }
}
