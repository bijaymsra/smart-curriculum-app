package com.attenza.backend.analytics.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseAnalyticsDTO {

    private Long subjectId;
    private String subjectCode;
    private String subjectName;

    private long totalSubmissions;
    private long approvedSubmissions;

    private double averageAttendancePercentage;
}
