package com.attenza.backend.ai.insight;

import com.attenza.backend.ai.analyzer.GapAnalyzer;
import com.attenza.backend.ai.model.GapAnalysisResult;
import com.attenza.backend.ai.model.TimetableEfficiencySummary;
import com.attenza.backend.ai.service.AITimetableLoaderService;
import com.attenza.backend.entity.Faculty;
import com.attenza.backend.repository.faculty.FacultyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class TimetableEfficiencyEngine {

    private final FacultyRepository facultyRepository;
    private final AITimetableLoaderService loaderService;
    private final GapAnalyzer gapAnalyzer;

    public TimetableEfficiencySummary generateInstitutionEfficiency() {

        List<Faculty> facultyList = facultyRepository.findAll();

        int totalSlots = 0;
        double totalGapMinutes = 0;
        int overloadCount = 0;
        int lunchCompliance = 0;
        int totalDays = 0;

        for (Faculty faculty : facultyList) {

            var schedule = loaderService.loadFacultySchedule(faculty.getId());
            totalSlots += schedule.size();

            List<GapAnalysisResult> results =
                    gapAnalyzer.analyzeFacultySchedule(faculty.getId(), schedule);

            for (GapAnalysisResult result : results) {

                totalDays++;

                if (result.isViolatesConsecutiveLimit()) {
                    overloadCount++;
                }

                if (result.isHasLunchBreak()) {
                    lunchCompliance++;
                }

                totalGapMinutes +=
                        result.getGaps().stream()
                                .mapToDouble(g -> g.getDurationMinutes())
                                .sum();
            }
        }

        double avgGap =
                totalDays == 0 ? 0 : totalGapMinutes / totalDays;

        double overloadRate =
                totalDays == 0 ? 0 : (overloadCount * 100.0) / totalDays;

        double lunchRate =
                totalDays == 0 ? 100 : (lunchCompliance * 100.0) / totalDays;

        double efficiencyScore =
                100
                        - (avgGap * 0.1)
                        - (overloadRate * 0.3)
                        + (lunchRate * 0.2);

        if (efficiencyScore > 100) efficiencyScore = 100;
        if (efficiencyScore < 0) efficiencyScore = 0;

        return TimetableEfficiencySummary.builder()
                .totalFaculty(facultyList.size())
                .totalScheduledSlots(totalSlots)
                .averageGapMinutes(avgGap)
                .overloadRate(overloadRate)
                .lunchComplianceRate(lunchRate)
                .efficiencyScore(efficiencyScore)
                .build();
    }
}
