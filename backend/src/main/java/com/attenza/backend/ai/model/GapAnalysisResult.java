package com.attenza.backend.ai.model;

import lombok.Builder;
import lombok.Data;

import java.time.DayOfWeek;
import java.util.List;

@Data
@Builder
public class GapAnalysisResult {

    private Long facultyId;
    private DayOfWeek dayOfWeek;

    private int totalClasses;
    private int consecutiveMax;

    private boolean hasLunchBreak;
    private boolean violatesConsecutiveLimit;

    private List<GapInfo> gaps;
}
