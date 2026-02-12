package com.attenza.backend.attendance.service;

import com.attenza.backend.attendance.entity.AttendanceSession;
import com.attenza.backend.attendance.entity.AttendanceSessionStatus;
import com.attenza.backend.attendance.repository.AttendanceSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

import com.attenza.backend.attendance.entity.AttendanceSubmission;
import com.attenza.backend.attendance.entity.AttendanceSubmissionStatus;
import com.attenza.backend.attendance.repository.AttendanceSubmissionRepository;


@Service
@RequiredArgsConstructor
public class AttendanceFinalizationService {

    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceSubmissionRepository submissionRepository;

    @Transactional
    public void finalizeSession(String sessionId) {

        AttendanceSession session = sessionRepository
                .findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Attendance session not found"));

        if (session.getStatus() == AttendanceSessionStatus.FINALIZED) {
            throw new RuntimeException("Attendance already finalized");
        }

        if (session.getStatus() != AttendanceSessionStatus.ACTIVE
                && session.getStatus() != AttendanceSessionStatus.EXPIRED) {
            throw new RuntimeException("Session cannot be finalized");
        }

        List<AttendanceSubmission> submissions =
                submissionRepository.findBySessionId(sessionId);

        for (AttendanceSubmission submission : submissions) {
            if (submission.getStatus() == AttendanceSubmissionStatus.PENDING) {
                submission.setStatus(AttendanceSubmissionStatus.APPROVED);
            }
        }

        submissionRepository.saveAll(submissions);

        session.setStatus(AttendanceSessionStatus.FINALIZED);
        sessionRepository.save(session);
    }
}
