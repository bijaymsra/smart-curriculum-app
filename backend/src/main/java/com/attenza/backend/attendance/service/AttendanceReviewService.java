package com.attenza.backend.attendance.service;

import com.attenza.backend.attendance.entity.AttendanceSubmission;
import com.attenza.backend.attendance.entity.AttendanceSubmissionStatus;
import com.attenza.backend.attendance.entity.AttendanceSession;
import com.attenza.backend.attendance.entity.AttendanceSessionStatus;
import com.attenza.backend.attendance.repository.AttendanceSubmissionRepository;
import com.attenza.backend.attendance.repository.AttendanceSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AttendanceReviewService {

    private final AttendanceSubmissionRepository submissionRepository;
    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceSessionService sessionService;

    /* =========================
       Approve submission
       ========================= */
    @Transactional
    public void approve(Long submissionId) {
        updateStatus(submissionId, AttendanceSubmissionStatus.APPROVED);
    }

    /* =========================
       Reject submission
       ========================= */
    @Transactional
    public void reject(Long submissionId) {
        updateStatus(submissionId, AttendanceSubmissionStatus.REJECTED);
    }

    /* =========================
       Flag submission
       ========================= */
    @Transactional
    public void flag(Long submissionId) {
        updateStatus(submissionId, AttendanceSubmissionStatus.FLAGGED);
    }

    /* =========================
       Internal Status Update Logic
       ========================= */

    @Transactional
    public void updateStatus(Long submissionId,
                            AttendanceSubmissionStatus newStatus) {

        AttendanceSubmission submission = submissionRepository
                .findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        AttendanceSession session = sessionRepository
                .findById(submission.getSessionId())
                .orElseThrow(() -> new RuntimeException("Attendance session not found"));

        if (session.getStatus() == AttendanceSessionStatus.FINALIZED) {
            throw new RuntimeException("Cannot modify finalized attendance");
        }

        submission.setStatus(newStatus);
        submissionRepository.save(submission);

        sessionService.pushReviewUpdate(
                submission.getSessionId(),
                Map.of(
                        "submissionId", submission.getId(),
                        "studentId", submission.getStudentId(),
                        "studentName", submission.getStudentName(),
                        "status", submission.getStatus().name()
                )
        );
    }

}
