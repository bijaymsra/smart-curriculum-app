package com.attenza.backend.analytics.service;

import com.attenza.backend.analytics.dto.FacultyAnalyticsResponse;
import com.attenza.backend.attendance.entity.AttendanceSession;
import com.attenza.backend.attendance.entity.AttendanceSessionStatus;
import com.attenza.backend.attendance.entity.AttendanceSubmission;
import com.attenza.backend.attendance.entity.AttendanceSubmissionStatus;
import com.attenza.backend.attendance.repository.AttendanceSessionRepository;
import com.attenza.backend.attendance.repository.AttendanceSubmissionRepository;
import com.attenza.backend.timetable.entity.TimetableEntry;
import com.attenza.backend.timetable.repository.TimetableRepository;
import com.attenza.backend.timetable.service.StudentGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacultyAnalyticsService {

    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceSubmissionRepository submissionRepository;
    private final TimetableRepository timetableRepository;
    private final StudentGroupService studentGroupService;

    public FacultyAnalyticsResponse getFacultyAnalytics(String facultyId) {

        List<AttendanceSession> sessions =
                sessionRepository.findAll()
                        .stream()
                        .filter(s -> s.getFacultyId().equals(facultyId))
                        .toList();

        int totalSessions = sessions.size();

        List<AttendanceSession> finalized =
                sessions.stream()
                        .filter(s -> s.getStatus() == AttendanceSessionStatus.FINALIZED)
                        .toList();

        int finalizedCount = finalized.size();
        int expiredCount = (int) sessions.stream()
                .filter(s -> s.getStatus() == AttendanceSessionStatus.EXPIRED)
                .count();

        int cancelledCount = (int) sessions.stream()
                .filter(s -> s.getStatus() == AttendanceSessionStatus.CANCELLED)
                .count();

        double completionRate =
                totalSessions == 0 ? 0 :
                        (finalizedCount * 100.0) / totalSessions;

        /* =========================
           SESSION DURATION
           ========================= */

        int avgDuration = (int) finalized.stream()
                .mapToLong(s ->
                        Duration.between(
                                s.getStartTime(),
                                s.getExpiryTime()
                        ).toMinutes()
                )
                .average()
                .orElse(0);

        /* =========================
           DYNAMIC PUNCTUALITY
           ========================= */

        int onTime = 0;
        int late = 0;
        double totalDelay = 0;

        for (AttendanceSession session : finalized) {

            TimetableEntry entry =
                    timetableRepository.findById(session.getClassId())
                            .orElse(null);

            if (entry == null) continue;

            LocalTime scheduledStart =
                    entry.getTimeSlot().getStartTime();

            LocalTime actualStart =
                    session.getStartTime().toLocalTime();

            long delay =
                    Duration.between(scheduledStart, actualStart).toMinutes();

            if (delay <= 2) {
                onTime++;
            } else {
                late++;
                totalDelay += delay;
            }
        }

        double punctualityPercentage =
                finalizedCount == 0 ? 0 :
                        (onTime * 100.0) / finalizedCount;

        double averageDelay =
                late == 0 ? 0 : totalDelay / late;

        /* =========================
           ATTENDANCE STATS
           ========================= */

        List<Double> attendancePercentages = new ArrayList<>();

        for (AttendanceSession session : finalized) {

            List<AttendanceSubmission> approved =
                    submissionRepository.findBySessionId(session.getSessionId())
                            .stream()
                            .filter(sub ->
                                    sub.getStatus() == AttendanceSubmissionStatus.APPROVED)
                            .toList();

            TimetableEntry entry =
                    timetableRepository.findById(session.getClassId())
                            .orElse(null);

            if (entry == null) continue;

            int totalStudents =
                    (int) studentGroupService.getStudentCount(
                            entry.getStudentGroup());

            if (totalStudents == 0) continue;

            double percentage =
                    (approved.size() * 100.0) / totalStudents;

            attendancePercentages.add(percentage);
        }

        double avgAttendance =
                attendancePercentages.stream()
                        .mapToDouble(Double::doubleValue)
                        .average()
                        .orElse(0);

        double highestAttendance =
                attendancePercentages.stream()
                        .mapToDouble(Double::doubleValue)
                        .max()
                        .orElse(0);

        double lowestAttendance =
                attendancePercentages.stream()
                        .mapToDouble(Double::doubleValue)
                        .min()
                        .orElse(0);

        /* =========================
           SUBJECT STATS
           ========================= */

        Map<String, List<Double>> subjectAttendanceMap = new HashMap<>();

        for (AttendanceSession session : finalized) {

            TimetableEntry entry =
                    timetableRepository.findById(session.getClassId())
                            .orElse(null);

            if (entry == null) continue;

            String subjectCode =
                    entry.getCourseOffering()
                            .getSubject()
                            .getSubjectCode();

            List<AttendanceSubmission> approved =
                    submissionRepository.findBySessionId(session.getSessionId())
                            .stream()
                            .filter(sub ->
                                    sub.getStatus() == AttendanceSubmissionStatus.APPROVED)
                            .toList();

            int totalStudents =
                    (int) studentGroupService.getStudentCount(
                            entry.getStudentGroup());

            if (totalStudents == 0) continue;

            double percentage =
                    (approved.size() * 100.0) / totalStudents;

            subjectAttendanceMap
                    .computeIfAbsent(subjectCode, k -> new ArrayList<>())
                    .add(percentage);
        }

        List<FacultyAnalyticsResponse.SubjectStats> subjectStats =
                subjectAttendanceMap.entrySet()
                        .stream()
                        .map(entry -> {

                            double avg =
                                    entry.getValue().stream()
                                            .mapToDouble(Double::doubleValue)
                                            .average()
                                            .orElse(0);

                            return FacultyAnalyticsResponse.SubjectStats.builder()
                                    .subjectCode(entry.getKey())
                                    .subjectName(entry.getKey()) // improve later if needed
                                    .sessionsConducted(entry.getValue().size())
                                    .averageAttendancePercentage(avg)
                                    .build();
                        })
                        .toList();

        return FacultyAnalyticsResponse.builder()
                .overview(FacultyAnalyticsResponse.Overview.builder()
                        .totalSessions(totalSessions)
                        .finalizedSessions(finalizedCount)
                        .expiredSessions(expiredCount)
                        .cancelledSessions(cancelledCount)
                        .completionRate(completionRate)
                        .averageSessionDurationMinutes(avgDuration)
                        .build())
                .attendanceStats(FacultyAnalyticsResponse.AttendanceStats.builder()
                        .averageAttendancePercentage(avgAttendance)
                        .highestAttendancePercentage(highestAttendance)
                        .lowestAttendancePercentage(lowestAttendance)
                        .build())
                .punctualityStats(FacultyAnalyticsResponse.PunctualityStats.builder()
                        .onTimeSessions(onTime)
                        .lateSessions(late)
                        .punctualityPercentage(punctualityPercentage)
                        .averageDelayMinutes(averageDelay)
                        .build())
                .subjectStats(subjectStats)
                .build();
    }
}
