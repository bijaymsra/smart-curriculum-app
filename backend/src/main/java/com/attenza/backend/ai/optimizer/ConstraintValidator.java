package com.attenza.backend.ai.optimizer;

import com.attenza.backend.ai.model.AITimetableEntry;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;

@Component
public class ConstraintValidator {

    public boolean isOverlapping(AITimetableEntry candidate,
                                 List<AITimetableEntry> existing) {

        for (AITimetableEntry entry : existing) {

            if (entry.getEntryId().equals(candidate.getEntryId())) continue;

            boolean overlap =
                    candidate.getSlot().getStartTime()
                            .isBefore(entry.getSlot().getEndTime())
                            &&
                    candidate.getSlot().getEndTime()
                            .isAfter(entry.getSlot().getStartTime());

            if (overlap) return true;
        }

        return false;
    }

    public boolean fitsInsideGap(AITimetableEntry entry,
                                 java.time.LocalTime gapStart,
                                 java.time.LocalTime gapEnd) {

        long duration = entry.getSlot().getDurationMinutes();

        long gapDuration =
                Duration.between(gapStart, gapEnd).toMinutes();

        return duration <= gapDuration;
    }
}
