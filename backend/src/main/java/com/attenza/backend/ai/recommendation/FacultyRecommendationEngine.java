package com.attenza.backend.ai.recommendation;

import com.attenza.backend.ai.analyzer.AttendanceAnalyzer;
import com.attenza.backend.ai.analyzer.GapAnalyzer;
import com.attenza.backend.ai.dto.RecommendationResponse;
import com.attenza.backend.ai.model.GapAnalysisResult;
import com.attenza.backend.ai.service.AITimetableLoaderService;
import com.attenza.backend.repository.faculty.FacultyRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class FacultyRecommendationEngine {

    private final AITimetableLoaderService loaderService;
    private final GapAnalyzer gapAnalyzer;
    private final AttendanceAnalyzer attendanceAnalyzer;
    private final FacultyRepository facultyRepository;


    public List<RecommendationResponse> generate(Long facultyId) {

        List<RecommendationResponse> responses = new ArrayList<>();

        var schedule = loaderService.loadFacultySchedule(facultyId);

        List<GapAnalysisResult> results =
                gapAnalyzer.analyzeFacultySchedule(facultyId, schedule);

        for (GapAnalysisResult result : results) {

            if (result.getGaps().stream().anyMatch(g -> g.isLargeGap())) {
                responses.add(
                        RecommendationResponse.builder()
                                .type("FACULTY")
                                .severity("SUGGESTION")
                                .message("Large gap detected on "
                                        + result.getDayOfWeek()
                                        + ". Consider mentoring or revision session.")
                                .build()
                );
            }

            if (result.isViolatesConsecutiveLimit()) {
                responses.add(
                        RecommendationResponse.builder()
                                .type("FACULTY")
                                .severity("ALERT")
                                .message("Too many consecutive classes on "
                                        + result.getDayOfWeek()
                                        + ". Consider redistributing workload.")
                                .build()
                );
            }
        }

        double avgAttendance =
                attendanceAnalyzer.calculateFacultyAttendance(facultyId);

        if (avgAttendance < 75) {
            responses.add(
                    RecommendationResponse.builder()
                            .type("FACULTY")
                            .severity("ALERT")
                            .message("Low average attendance ("
                                    + String.format("%.1f", avgAttendance)
                                    + "%). Consider engagement strategies.")
                            .build()
            );
        }

        if (responses.isEmpty()) {
            responses.add(
                    RecommendationResponse.builder()
                            .type("FACULTY")
                            .severity("INFO")
                            .message("Your timetable and performance look healthy.")
                            .build()
            );
        }

        return responses;
    }


    public List<RecommendationResponse> generateByFacultyCode(String facultyCode) {

        var faculty = facultyRepository
                .findByFacultyId(facultyCode)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        Long internalId = faculty.getId();

        return generate(internalId);  // reuse existing method
        }

}
