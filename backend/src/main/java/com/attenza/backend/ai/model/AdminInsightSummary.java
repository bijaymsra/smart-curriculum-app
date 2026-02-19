package com.attenza.backend.ai.model;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminInsightSummary {

    private int totalFaculty;
    private int overloadedFaculty;
    private int underUtilizedFaculty;

    private int totalStudents;
    private int atRiskStudents;

    private double institutionAttendanceAverage;

    private List<String> alerts;
}
