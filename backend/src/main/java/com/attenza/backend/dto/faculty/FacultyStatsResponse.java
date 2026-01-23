package com.attenza.backend.dto.faculty;

import lombok.Data;

@Data
public class FacultyStatsResponse {
    private Long totalFaculty;
    private Long activeFaculty;
    private Double avgUtilization;
    private Double avgPunctuality;
    private Long warningFaculty;
    private Long onLeaveFaculty;
}