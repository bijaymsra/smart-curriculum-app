package com.attenza.backend.analytics.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDashboardResponse {

    private KpiResponse kpis;

    private List<RoomAnalyticsDTO> idleRooms;

    private List<FacultyAnalyticsDTO> facultyWorkload;

    private List<CourseAnalyticsDTO> attendanceTrends;

    private List<AlertDTO> alerts;
}
