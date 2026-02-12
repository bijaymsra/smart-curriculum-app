package com.attenza.backend.dto.faculty;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class FacultyDashboardResponse {

    private int todayClassesCount;
    private long totalSessionsConducted;
    private boolean activeSession;
    private int profileCompletionPercentage;
    private List<TodayClassDTO> todayClasses;
}
