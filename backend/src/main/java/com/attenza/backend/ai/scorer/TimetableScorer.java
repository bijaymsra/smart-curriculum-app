package com.attenza.backend.ai.scorer;

import com.attenza.backend.ai.model.*;

import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.List;

@Component
public class TimetableScorer {

    private static final int BASE_SCORE = 100;

    private static final int CONSECUTIVE_PENALTY = 20;
    private static final int LARGE_GAP_PENALTY = 10;
    private static final int NO_LUNCH_PENALTY = 15;
    private static final int EARLY_SLOT_PENALTY = 5;
    private static final int LATE_SLOT_PENALTY = 5;

    private static final LocalTime EARLY_TIME = LocalTime.of(8, 0);
    private static final LocalTime LATE_TIME = LocalTime.of(17, 0);

    public int scoreDay(GapAnalysisResult result,
                        List<AITimetableEntry> dailyEntries) {

        int score = BASE_SCORE;

        // 1️⃣ Consecutive violation
        if (result.isViolatesConsecutiveLimit()) {
            score -= CONSECUTIVE_PENALTY;
        }

        // 2️⃣ Large gaps
        for (GapInfo gap : result.getGaps()) {
            if (gap.isLargeGap()) {
                score -= LARGE_GAP_PENALTY;
            }
        }

        // 3️⃣ Lunch violation
        if (!result.isHasLunchBreak()) {
            score -= NO_LUNCH_PENALTY;
        }

        // 4️⃣ Early / Late penalties
        for (AITimetableEntry entry : dailyEntries) {

            if (entry.getSlot().getStartTime().equals(EARLY_TIME)) {
                score -= EARLY_SLOT_PENALTY;
            }

            if (entry.getSlot().getEndTime().equals(LATE_TIME)) {
                score -= LATE_SLOT_PENALTY;
            }
        }

        return Math.max(score, 0);
    }
}
