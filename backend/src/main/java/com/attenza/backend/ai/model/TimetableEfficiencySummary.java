package com.attenza.backend.ai.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TimetableEfficiencySummary {

    private int totalFaculty;
    private int totalScheduledSlots;

    private double averageGapMinutes;
    private double overloadRate;
    private double lunchComplianceRate;

    private double efficiencyScore; // 0–100
}
