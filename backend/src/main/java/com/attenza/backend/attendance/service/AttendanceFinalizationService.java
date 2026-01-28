package com.attenza.backend.attendance.service;

import com.attenza.backend.attendance.entity.AttendanceSession;
import com.attenza.backend.attendance.entity.AttendanceSessionStatus;
import com.attenza.backend.attendance.entity.AttendanceSubmission;
import com.attenza.backend.attendance.entity.AttendanceSubmissionStatus;
import com.attenza.backend.attendance.repository.AttendanceSessionRepository;
import com.attenza.backend.attendance.repository.AttendanceSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceFinalizationService {

    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceSubmissionRepository submissionRepository;

    /**
     * FINAL & IRREVERSIBLE attendance lock
     * PRESENT / ABSENT is decided ONLY here
     */
    @Transactional
    public void finalizeSession(String sessionId) {

        AttendanceSession session = sessionRepository
                .findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Attendance session not found"));

        if (session.isFinalised()
                || session.getStatus() == AttendanceSessionStatus.FINALIZED) {
            throw new RuntimeException("Attendance already finalized");
        }

        /* =========================
           1. Fetch all submissions
           ========================= */
        List<AttendanceSubmission> submissions =
                submissionRepository.findBySessionId(sessionId);

        /* =========================
           2. Decide PRESENT / ABSENT
           ========================= */
        for (AttendanceSubmission submission : submissions) {

            boolean present =
                    submission.isPhase1Verified()
                    && submission.isPhase2Verified();

            if (present) {
                submission.setStatus(AttendanceSubmissionStatus.APPROVED);
            } else {
                submission.setStatus(AttendanceSubmissionStatus.REJECTED);
            }
        }

        submissionRepository.saveAll(submissions);

        /* =========================
           3. Lock session forever
           ========================= */
        session.setFinalised(true);
        session.setStatus(AttendanceSessionStatus.FINALIZED);

        sessionRepository.save(session);
    }
}
