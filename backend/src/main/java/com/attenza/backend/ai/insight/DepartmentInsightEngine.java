package com.attenza.backend.ai.insight;

import com.attenza.backend.ai.analyzer.AttendanceAnalyzer;
import com.attenza.backend.ai.model.DepartmentInsight;
import com.attenza.backend.ai.service.AITimetableLoaderService;
import com.attenza.backend.entity.Department;
import com.attenza.backend.entity.Faculty;
import com.attenza.backend.repository.admin.StudentRepository;
import com.attenza.backend.repository.faculty.DepartmentRepository;
import com.attenza.backend.repository.faculty.FacultyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DepartmentInsightEngine {

    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;
    private final AttendanceAnalyzer attendanceAnalyzer;
    private final AITimetableLoaderService loaderService;

    public List<DepartmentInsight> generateInstitutionDepartmentInsights(Long institutionId) {

        List<Department> departments =
                departmentRepository.findAll();

        List<DepartmentInsight> insights = new ArrayList<>();

        for (Department department : departments) {

            List<Faculty> facultyList =
                    facultyRepository.findByDepartmentId(department.getId());

            int overloaded = 0;
            int underUtilized = 0;

            for (Faculty faculty : facultyList) {

                var schedule =
                        loaderService.loadFacultySchedule(faculty.getId());

                if (schedule.size() > 20) overloaded++;
                if (schedule.size() < 5) underUtilized++;
            }


            int studentCount =
            studentRepository.countByCourse(department.getDepartmentName().contains("Computer Science") ? "CSE" : null);


            double attendanceAvg =
                    attendanceAnalyzer.calculateFacultyAttendance(1L); // placeholder

            String riskLevel = "LOW";

            if (attendanceAvg < 75 || overloaded > 2) {
                riskLevel = "MODERATE";
            }

            if (attendanceAvg < 60) {
                riskLevel = "HIGH";
            }

            insights.add(
                    DepartmentInsight.builder()
                            .departmentName(department.getDepartmentName())
                            .facultyCount(facultyList.size())
                            .studentCount(studentCount)
                            .averageAttendance(attendanceAvg)
                            .overloadedFaculty(overloaded)
                            .underUtilizedFaculty(underUtilized)
                            .riskLevel(riskLevel)
                            .build()
            );
        }

        return insights;
    }
}
