package com.attenza.backend.ai.optimizer;

import com.attenza.backend.ai.analyzer.GapAnalyzer;
import com.attenza.backend.ai.model.*;
import com.attenza.backend.ai.scorer.TimetableScorer;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TimetableOptimizer {

    private final GapAnalyzer gapAnalyzer;
    private final TimetableScorer scorer;
    private final ConstraintValidator validator;


    public Optional<List<AITimetableEntry>> optimizeDay(Long facultyId,
                                                        List<AITimetableEntry> dailyEntries) {

        // Analyze original
        var originalAnalysis =
                gapAnalyzer.analyzeFacultySchedule(facultyId, dailyEntries)
                        .stream()
                        .findFirst()
                        .orElse(null);

        if (originalAnalysis == null) return Optional.empty();

        int originalScore =
                scorer.scoreDay(originalAnalysis, dailyEntries);

        // Detect large gap
        Optional<GapInfo> largeGap =
                originalAnalysis.getGaps().stream()
                        .filter(GapInfo::isLargeGap)
                        .findFirst();

        if (largeGap.isEmpty()) {
            return Optional.empty(); // nothing to optimize
        }

        // Try simple shift heuristic
        List<AITimetableEntry> candidate =
                tryShiftIntoGap(dailyEntries, largeGap.get());

        if (candidate == null) return Optional.empty();

        var newAnalysis =
                gapAnalyzer.analyzeFacultySchedule(facultyId, candidate)
                        .stream()
                        .findFirst()
                        .orElse(null);

        if (newAnalysis == null) {
            return Optional.empty();
        }

        int newScore =
                scorer.scoreDay(newAnalysis, candidate);

        if (newAnalysis.isViolatesConsecutiveLimit()) {
            return Optional.empty();
        }

        if (newScore > originalScore) {
            return Optional.of(candidate);
        }


        return Optional.empty();
    }

private List<AITimetableEntry> tryShiftIntoGap(
        List<AITimetableEntry> entries,
        GapInfo gap) {

    List<AITimetableEntry> sorted =
            entries.stream()
                    .sorted(Comparator.comparing(e -> e.getSlot().getStartTime()))
                    .toList();

    for (AITimetableEntry entry : sorted) {

        // Only consider entries AFTER gap
        if (entry.getSlot().getStartTime().isAfter(gap.getGapEnd())) {

            // Check if duration fits in gap
            if (!validator.fitsInsideGap(entry,
                    gap.getGapStart(),
                    gap.getGapEnd())) {
                continue;
            }

            // Create candidate moved entry
            var newStart = gap.getGapStart();
            var newEnd = newStart
                    .plusMinutes(entry.getSlot().getDurationMinutes());

            var newSlot = entry.getSlot().toBuilder()
                    .startTime(newStart)
                    .endTime(newEnd)
                    .build();

            var modified = entry.toBuilder()
                    .slot(newSlot)
                    .build();

            List<AITimetableEntry> newList =
                    new java.util.ArrayList<>(sorted);

            newList.remove(entry);
            newList.add(modified);

            // Overlap check
            if (validator.isOverlapping(modified, newList)) {
                continue;
            }

            return newList;
        }
    }

    return null;
}

}
