package com.attenza.backend.ai.recommendation;

import com.attenza.backend.ai.analyzer.AttendanceAnalyzer;
import com.attenza.backend.ai.model.AdminInsightSummary;
import com.attenza.backend.ai.service.AITimetableLoaderService;
import com.attenza.backend.entity.Faculty;
import com.attenza.backend.repository.faculty.FacultyRepository;
import com.attenza.backend.repository.admin.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AdminRecommendationEngine {

    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;
    private final AITimetableLoaderService loaderService;
    private final AttendanceAnalyzer attendanceAnalyzer;

    public AdminInsightSummary generateInstitutionInsight() {

        List<Faculty> facultyList = facultyRepository.findAll();
        int overloaded = 0;
        int underUtilized = 0;

        for (Faculty faculty : facultyList) {

            var schedule = loaderService.loadFacultySchedule(faculty.getId());

            if (schedule.size() > 20) {
                overloaded++;
            }

            if (schedule.size() < 5) {
                underUtilized++;
            }
        }

        int totalStudents = (int) studentRepository.count();
        int atRiskStudents = 0;

        double attendanceAvg =
                attendanceAnalyzer.calculateFacultyAttendance(1L); 
                

        List<String> alerts = new ArrayList<>();

        if (overloaded > 0) {
            alerts.add(overloaded + " faculty members appear overloaded.");
        }

        if (underUtilized > 0) {
            alerts.add(underUtilized + " faculty members appear underutilized.");
        }

        if (attendanceAvg < 75) {
            alerts.add("Institution-wide attendance is declining.");
        }

        return AdminInsightSummary.builder()
                .totalFaculty(facultyList.size())
                .overloadedFaculty(overloaded)
                .underUtilizedFaculty(underUtilized)
                .totalStudents(totalStudents)
                .atRiskStudents(atRiskStudents)
                .institutionAttendanceAverage(attendanceAvg)
                .alerts(alerts)
                .build();
    }
}
