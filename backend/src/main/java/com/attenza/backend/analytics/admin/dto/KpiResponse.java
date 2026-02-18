package com.attenza.backend.analytics.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KpiResponse {

    private double classroomUtilization;   // %
    private double facultyEfficiency;      // %
    private double attendanceRate;         // %
    private double timeWastageHours;       // hours
}
