package com.attenza.backend.ai.model;

import lombok.Builder;
import lombok.Data;

import java.time.DayOfWeek;
import java.util.List;

@Data
@Builder
public class AIDailySchedule {

    private DayOfWeek dayOfWeek;
    private List<AITimetableEntry> entries;
}
