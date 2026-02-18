package com.attenza.backend.student.tasks.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentTaskStatsDTO {

    private long total;
    private long completed;
    private long pending;
    private long overdue;

    private int completionRate;
    private int pointsEarned;
    private int streak;
}
