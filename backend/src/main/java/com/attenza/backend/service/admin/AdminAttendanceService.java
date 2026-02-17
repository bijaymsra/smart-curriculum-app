package com.attenza.backend.service.admin;

import com.attenza.backend.attendance.entity.AttendanceSession;
import com.attenza.backend.attendance.entity.AttendanceSessionStatus;
import com.attenza.backend.attendance.entity.AttendanceSubmission;
import com.attenza.backend.attendance.entity.AttendanceSubmissionStatus;
import com.attenza.backend.attendance.repository.AttendanceSessionRepository;
import com.attenza.backend.attendance.repository.AttendanceSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminAttendanceService {

    private final AttendanceSessionRepository sessionRepo;
    private final AttendanceSubmissionRepository submissionRepo;

    /**
     * Admin Overview Statistics
     */
    public Map<String, Object> getOverviewStats() {

        Map<String, Object> response = new HashMap<>();

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        long activeSessions =
                sessionRepo.countByStatus(AttendanceSessionStatus.ACTIVE);

        long finalizedToday =
                sessionRepo.countByStatusAndStartTimeBetween(
                        AttendanceSessionStatus.FINALIZED,
                        startOfDay,
                        endOfDay
                );

        long flagged =
                submissionRepo.countByStatus(
                        AttendanceSubmissionStatus.FLAGGED
                );

        long pending =
                submissionRepo.countByStatus(
                        AttendanceSubmissionStatus.PENDING
                );

        response.put("activeSessions", activeSessions);
        response.put("finalizedToday", finalizedToday);
        response.put("flaggedSubmissions", flagged);
        response.put("pendingReviews", pending);

        return response;
    }

    /**
     * Fetch sessions (optional filter by status)
     */
    public List<AttendanceSession> getSessions(String status) {

        if (status != null && !status.isBlank()) {
            AttendanceSessionStatus sessionStatus =
                    AttendanceSessionStatus.valueOf(status.toUpperCase());
            return sessionRepo.findByStatus(sessionStatus);
        }

        return sessionRepo.findAll();
    }

    /**
     * Fetch submissions for review (optional filter by status)
     */
    public List<AttendanceSubmission> getSubmissionsForReview(String status) {

        if (status != null && !status.isBlank()) {
            AttendanceSubmissionStatus submissionStatus =
                    AttendanceSubmissionStatus.valueOf(status.toUpperCase());
            return submissionRepo.findByStatus(submissionStatus);
        }

        return submissionRepo.findAll();
    }
}
