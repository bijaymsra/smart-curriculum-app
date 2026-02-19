package com.attenza.backend.ai.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentRiskSummary {

    private int totalStudents;

    private int lowRisk;
    private int moderateRisk;
    private int highRisk;
}
