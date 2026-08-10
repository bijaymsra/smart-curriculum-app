package com.attenza.backend.ai.analyzer;

import com.attenza.backend.ai.model.*;

import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class GapAnalyzer {

    private static final int MAX_CONSECUTIVE_LIMIT = 3;
    private static final int LARGE_GAP_THRESHOLD_MINUTES = 120;

    private static final LocalTime LUNCH_START = LocalTime.of(12, 0);
    private static final LocalTime LUNCH_END = LocalTime.of(14, 0);

    public List<GapAnalysisResult> analyzeFacultySchedule(Long facultyId,
                                                          List<AITimetableEntry> entries) {

        Map<DayOfWeek, List<AITimetableEntry>> grouped =
                entries.stream()
                        .collect(Collectors.groupingBy(e -> e.getSlot().getDayOfWeek()));

        List<GapAnalysisResult> results = new ArrayList<>();

        for (DayOfWeek day : grouped.keySet()) {

            List<AITimetableEntry> dailyEntries = grouped.get(day);

            dailyEntries.sort(Comparator.comparing(e -> e.getSlot().getStartTime()));

            List<GapInfo> gaps = new ArrayList<>();
            int maxConsecutive = 1;
            int currentConsecutive = 1;

            boolean hasLunchBreak = false;

            for (int i = 0; i < dailyEntries.size(); i++) {

                AITimetableEntry current = dailyEntries.get(i);

                // Lunch detection
                if (isWithinLunchWindow(current.getSlot().getStartTime(),
                        current.getSlot().getEndTime())) {
                    hasLunchBreak = true;
                }

                if (i < dailyEntries.size() - 1) {

                    AITimetableEntry next = dailyEntries.get(i + 1);

                    long gapMinutes = Duration.between(
                            current.getSlot().getEndTime(),
                            next.getSlot().getStartTime()
                    ).toMinutes();

                    if (gapMinutes == 0) {
                        currentConsecutive++;
                        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
                    } else {

                        currentConsecutive = 1;

                        if (gapMinutes > 0) {

                            boolean isLunchGap =
                                    isWithinLunchWindow(current.getSlot().getEndTime(),
                                            next.getSlot().getStartTime());

                            gaps.add(GapInfo.builder()
                                    .gapStart(current.getSlot().getEndTime())
                                    .gapEnd(next.getSlot().getStartTime())
                                    .durationMinutes(gapMinutes)
                                    .isLunchWindow(isLunchGap)
                                    .isLargeGap(gapMinutes >= LARGE_GAP_THRESHOLD_MINUTES)
                                    .build());

                            if (isLunchGap && gapMinutes >= 60) {
                                hasLunchBreak = true;
                            }
                        }
                    }
                }
            }

            results.add(GapAnalysisResult.builder()
                    .facultyId(facultyId)
                    .dayOfWeek(day)
                    .totalClasses(dailyEntries.size())
                    .consecutiveMax(maxConsecutive)
                    .hasLunchBreak(hasLunchBreak)
                    .violatesConsecutiveLimit(maxConsecutive > MAX_CONSECUTIVE_LIMIT)
                    .gaps(gaps)
                    .build());
        }

        return results;
    }

    private boolean isWithinLunchWindow(LocalTime start, LocalTime end) {
        return (start.isBefore(LUNCH_END) && end.isAfter(LUNCH_START));
    }
}
