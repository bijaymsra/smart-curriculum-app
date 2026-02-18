package com.attenza.backend.student.dashboard.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class StudentDashboardResponse {

    // Profile
    private String fullName;
    private String registrationNo;
    private String department;
    private String course;
    private Integer semester;
    private String section;

    // Attendance Summary
    private Integer totalClasses;
    private Integer attendedClasses;
    private Integer missedClasses;
    private Integer attendancePercentage;

    // Rank
    private Integer rank;
    private Integer totalStudents;

    // Today Classes
    private List<TodayClassDTO> todayClasses;

    private LocalDateTime lastActive;
}
