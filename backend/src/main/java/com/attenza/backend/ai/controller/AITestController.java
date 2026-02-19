package com.attenza.backend.ai.controller;

import com.attenza.backend.ai.analyzer.GapAnalyzer;
import com.attenza.backend.ai.dto.RecommendationResponse;
import com.attenza.backend.ai.insight.DepartmentInsightEngine;
import com.attenza.backend.ai.insight.StudentRiskEngine;
import com.attenza.backend.ai.insight.TimetableEfficiencyEngine;
import com.attenza.backend.ai.optimizer.TimetableOptimizer;
import com.attenza.backend.ai.recommendation.AdminRecommendationEngine;
import com.attenza.backend.ai.recommendation.FacultyRecommendationEngine;
import com.attenza.backend.ai.recommendation.StudentRecommendationEngine;
import com.attenza.backend.ai.scorer.TimetableScorer;
import com.attenza.backend.ai.service.AITimetableLoaderService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/ai/test")
@RequiredArgsConstructor
public class AITestController {

    private final AITimetableLoaderService loaderService;
    private final GapAnalyzer gapAnalyzer;
    private final TimetableScorer scorer;
    private final TimetableOptimizer optimizer;
    private final StudentRecommendationEngine studentRecommendationEngine;
    private final FacultyRecommendationEngine facultyRecommendationEngine;
    private final AdminRecommendationEngine adminRecommendationEngine;
    private final DepartmentInsightEngine departmentInsightEngine;
    private final TimetableEfficiencyEngine timetableEfficiencyEngine;
    private final StudentRiskEngine studentRiskEngine;


    @GetMapping("/faculty/{facultyId}/optimize")
    public Object optimizeFaculty(@PathVariable Long facultyId) {

        var schedule = loaderService.loadFacultySchedule(facultyId);

        var grouped = schedule.stream()
                .collect(Collectors.groupingBy(e -> e.getSlot().getDayOfWeek()));

        return grouped.entrySet().stream().map(entry -> {

            var result =
                    optimizer.optimizeDay(facultyId, entry.getValue());

            return java.util.Map.of(
                    "day", entry.getKey(),
                    "optimized", result.isPresent()
            );
        });
    }

    @GetMapping("/student/{studentId}/recommend")
    public List<RecommendationResponse> recommendStudent(
            @PathVariable Long studentId) {

        return studentRecommendationEngine.generateRecommendations(studentId);
    }


    @GetMapping("/faculty/{facultyId}/recommend")
    public List<RecommendationResponse> recommendFaculty(
            @PathVariable String facultyId) {

        return facultyRecommendationEngine.generateByFacultyCode(facultyId);
    }


    @GetMapping("/admin/insight")
    public Object adminInsight() {
        return adminRecommendationEngine.generateInstitutionInsight();
    }


    @GetMapping("/admin/departments/{institutionId}")
    public Object departmentInsights(@PathVariable Long institutionId) {
        return departmentInsightEngine
                .generateInstitutionDepartmentInsights(institutionId);
    }

    @GetMapping("/admin/efficiency")
    public Object timetableEfficiency() {
        return timetableEfficiencyEngine.generateInstitutionEfficiency();
    }

    @GetMapping("/admin/student-risk")
    public Object studentRiskSummary() {
        return studentRiskEngine.generateInstitutionRiskSummary();
    }

}
