package com.attenza.backend.analytics.admin.service;

import com.attenza.backend.analytics.admin.dto.*;
import com.attenza.backend.attendance.entity.AttendanceSessionStatus;
import com.attenza.backend.attendance.entity.AttendanceSubmissionStatus;
import com.attenza.backend.attendance.repository.AttendanceSessionRepository;
import com.attenza.backend.attendance.repository.AttendanceSubmissionRepository;
import com.attenza.backend.entity.AdminUser;
import com.attenza.backend.repository.admin.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AdminAnalyticsService {

    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceSubmissionRepository submissionRepository;
    private final AdminUserRepository adminUserRepository;


        public AnalyticsDashboardResponse getDashboard(String adminIdFromJwt, String range) {

        AdminUser admin = adminUserRepository
                .findById(Long.parseLong(adminIdFromJwt))
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Long institutionId = admin.getInstitution().getId();



        // ⏱ Time range
        LocalDateTime startTime = resolveStartTime(range);
        LocalDateTime now = LocalDateTime.now();

        // ===============================
        // KPI CALCULATIONS
        // ===============================

        long totalSessions = sessionRepository.count();


        long finalizedSessions =
                sessionRepository.findByStatus(AttendanceSessionStatus.FINALIZED).size();

        long cancelledSessions =
                sessionRepository.findByStatus(AttendanceSessionStatus.CANCELLED).size();

        long approvedSubmissions =
                submissionRepository.countByStatus(AttendanceSubmissionStatus.APPROVED);

        long totalSubmissions = submissionRepository.count();

        double attendanceRate =
                totalSubmissions == 0 ? 0 :
                        (approvedSubmissions * 100.0) / totalSubmissions;

        double facultyEfficiency =
                totalSessions == 0 ? 0 :
                        (finalizedSessions * 100.0) / totalSessions;

        double classroomUtilization = attendanceRate;
        double timeWastageHours = cancelledSessions * 1.0;

        KpiResponse kpis = KpiResponse.builder()
                .classroomUtilization(round(classroomUtilization))
                .facultyEfficiency(round(facultyEfficiency))
                .attendanceRate(round(attendanceRate))
                .timeWastageHours(round(timeWastageHours))
                .build();

        return AnalyticsDashboardResponse.builder()
                .kpis(kpis)
                .idleRooms(Collections.emptyList())
                .facultyWorkload(Collections.emptyList())
                .attendanceTrends(Collections.emptyList())
                .alerts(Collections.emptyList())
                .build();
    }

    private LocalDateTime resolveStartTime(String range) {
        LocalDateTime now = LocalDateTime.now();

        if (range == null) return now.minusDays(7);

        return switch (range.toLowerCase()) {
            case "day" -> now.minusDays(1);
            case "month" -> now.minusDays(30);
            default -> now.minusDays(7);
        };
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
