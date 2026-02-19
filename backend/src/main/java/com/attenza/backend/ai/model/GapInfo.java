package com.attenza.backend.ai.model;

import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;

@Data
@Builder
public class GapInfo {

    private LocalTime gapStart;
    private LocalTime gapEnd;

    private long durationMinutes;

    private boolean isLunchWindow;
    private boolean isLargeGap;
}
