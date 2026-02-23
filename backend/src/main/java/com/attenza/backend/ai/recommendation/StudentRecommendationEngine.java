package com.attenza.backend.ai.recommendation;

import com.attenza.backend.ai.dto.RecommendationResponse;
import com.attenza.backend.ai.analyzer.GapAnalyzer;
import com.attenza.backend.ai.model.GapInfo;
import com.attenza.backend.ai.service.AITimetableLoaderService;
import com.attenza.backend.student.tasks.entity.StudentTask;
import com.attenza.backend.student.tasks.repository.StudentTaskRepository;
import com.attenza.backend.attendance.repository.AttendanceSubmissionRepository;
import com.attenza.backend.attendance.entity.AttendanceSubmissionStatus;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Component
@RequiredArgsConstructor
public class StudentRecommendationEngine {

    private final StudentTaskRepository taskRepository;
    private final AttendanceSubmissionRepository attendanceRepository;
    private final AITimetableLoaderService timetableLoaderService;
    private final GapAnalyzer gapAnalyzer;

    private static final double ATTENDANCE_THRESHOLD = 75.0;

    public List<RecommendationResponse> generateRecommendations(Long studentId) {

        List<RecommendationResponse> recommendations = new ArrayList<>();

        // 1️⃣ Pending Tasks
        List<StudentTask> pendingTasks =
                taskRepository.findByStudentIdAndCompletedFalse(studentId);

        if (!pendingTasks.isEmpty()) {

            recommendations.add(
                    RecommendationResponse.builder()
                            .type("STUDENT")
                            .severity("SUGGESTION")
                            .message("You have " + pendingTasks.size()
                                    + " pending tasks. Consider completing them.")
                            .build()
            );

            pendingTasks.stream()
                    .filter(task -> task.getDueDate() != null &&
                            task.getDueDate().isBefore(LocalDate.now().plusDays(3)))
                    .forEach(task -> recommendations.add(
                            RecommendationResponse.builder()
                                    .type("STUDENT")
                                    .severity("ALERT")
                                    .message("Task '" + task.getTitle()
                                            + "' is due soon. Prioritize it.")
                                    .build()
                    ));
        }

        // 2️⃣ Attendance
        long total = attendanceRepository.countByStudentId(studentId);
        long approved = attendanceRepository.countByStudentIdAndStatus(
                studentId,
                AttendanceSubmissionStatus.APPROVED
        );

        if (total > 0) {
            double percentage = ((double) approved / total) * 100;

            if (percentage < ATTENDANCE_THRESHOLD) {
                recommendations.add(
                        RecommendationResponse.builder()
                                .type("STUDENT")
                                .severity("ALERT")
                                .message("Your attendance is "
                                        + String.format("%.2f", percentage)
                                        + "%. Improve it.")
                                .build()
                );
            }
        }

        // 3️⃣ Gap-Aware Recommendation
        var schedule = timetableLoaderService.loadStudentSchedule(studentId);

        DayOfWeek today = LocalDate.now().getDayOfWeek();

        var todayEntries = schedule.stream()
                .filter(e -> e.getSlot().getDayOfWeek().equals(today))
                .toList();

        if (!todayEntries.isEmpty()) {

            var analysis = gapAnalyzer.analyzeFacultySchedule(studentId, todayEntries);

            analysis.stream()
                    .flatMap(a -> a.getGaps().stream())
                    .filter(GapInfo::isLargeGap)
                    .findFirst()
                    .ifPresent(gap -> {

                        pendingTasks.stream()
                                .filter(task -> task.getEstimatedTime() != null &&
                                        task.getEstimatedTime() <= gap.getDurationMinutes())
                                .sorted(Comparator
                                        .comparing(StudentTask::getDueDate,
                                                Comparator.nullsLast(LocalDate::compareTo))
                                        .thenComparing(StudentTask::getPriority))
                                .findFirst()
                                .ifPresent(task -> recommendations.add(
                                        RecommendationResponse.builder()
                                                .type("STUDENT")
                                                .severity("SUGGESTION")
                                                .message("You have a "
                                                        + gap.getDurationMinutes() / 60
                                                        + "-hour gap today from "
                                                        + gap.getGapStart()
                                                        + " to "
                                                        + gap.getGapEnd()
                                                        + ". Complete '"
                                                        + task.getTitle()
                                                        + "' (" + task.getEstimatedTime()
                                                        + " mins).")
                                                .build()
                                ));
                    });
        }

        return recommendations;
    }

}
