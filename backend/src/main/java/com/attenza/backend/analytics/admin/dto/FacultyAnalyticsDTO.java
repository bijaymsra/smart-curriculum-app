package com.attenza.backend.analytics.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacultyAnalyticsDTO {

    private String facultyId;       // public ID (FACxxxx)
    private String facultyName;

    private long totalSessions;
    private long finalizedSessions;
    private long cancelledSessions;

    private double efficiencyPercentage;
}
