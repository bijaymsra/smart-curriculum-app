package com.attenza.backend.ai.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DepartmentInsight {

    private String departmentName;

    private int facultyCount;
    private int studentCount;

    private double averageAttendance;

    private int overloadedFaculty;
    private int underUtilizedFaculty;

    private String riskLevel; // LOW / MODERATE / HIGH
}
