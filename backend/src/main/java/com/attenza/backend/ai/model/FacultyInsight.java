package com.attenza.backend.ai.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FacultyInsight {

    private Long facultyId;

    private int totalWeeklyClasses;
    private int maxConsecutive;

    private boolean hasLargeGap;
    private boolean violatesConsecutiveLimit;

    private double averageAttendance;
    private boolean lowAttendanceRisk;

    private boolean underUtilized;

}
