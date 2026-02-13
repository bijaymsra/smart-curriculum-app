package com.attenza.backend.analytics.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class FacultyAnalyticsResponse {

    private Overview overview;
    private AttendanceStats attendanceStats;
    private PunctualityStats punctualityStats;
    private List<SubjectStats> subjectStats;

    /* =========================
       OVERVIEW SECTION
       ========================= */
    @Data
    @Builder
    public static class Overview {
        private int totalSessions;
        private int finalizedSessions;
        private int expiredSessions;
        private int cancelledSessions;
        private double completionRate;
        private int averageSessionDurationMinutes;
    }

    /* =========================
       ATTENDANCE PERFORMANCE
       ========================= */
    @Data
    @Builder
    public static class AttendanceStats {
        private double averageAttendancePercentage;
        private double highestAttendancePercentage;
        private double lowestAttendancePercentage;
    }

    /* =========================
       DYNAMIC PUNCTUALITY
       ========================= */
    @Data
    @Builder
    public static class PunctualityStats {
        private int onTimeSessions;
        private int lateSessions;
        private double punctualityPercentage;
        private double averageDelayMinutes;
    }

    /* =========================
       SUBJECT COMPARISON
       ========================= */
    @Data
    @Builder
    public static class SubjectStats {
        private String subjectCode;
        private String subjectName;
        private int sessionsConducted;
        private double averageAttendancePercentage;
    }
}
