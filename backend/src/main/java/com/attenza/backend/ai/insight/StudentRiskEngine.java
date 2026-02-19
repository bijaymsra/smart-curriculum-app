package com.attenza.backend.ai.insight;

import com.attenza.backend.ai.model.StudentRiskSummary;
import com.attenza.backend.attendance.entity.AttendanceSubmissionStatus;
import com.attenza.backend.attendance.repository.AttendanceSubmissionRepository;
import com.attenza.backend.repository.admin.StudentRepository;
import com.attenza.backend.student.tasks.repository.StudentTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StudentRiskEngine {

    private final StudentRepository studentRepository;
    private final AttendanceSubmissionRepository attendanceRepository;
    private final StudentTaskRepository taskRepository;

    public StudentRiskSummary generateInstitutionRiskSummary() {

        var students = studentRepository.findAll();

        int low = 0;
        int moderate = 0;
        int high = 0;

        for (var student : students) {

            long totalAttendance =
                    attendanceRepository.countByStudentId(student.getId());

            long approvedAttendance =
                    attendanceRepository.countByStudentIdAndStatus(
                            student.getId(),
                            AttendanceSubmissionStatus.APPROVED
                    );

            double attendancePercent =
                    totalAttendance == 0 ? 100 :
                            (approvedAttendance * 100.0) / totalAttendance;

            int pendingTasks =
                    taskRepository.findByStudentIdAndCompletedFalse(
                            student.getId()
                    ).size();

            boolean highRisk =
                    attendancePercent < 75 || pendingTasks >= 4;

            boolean moderateRisk =
                    (attendancePercent >= 75 && attendancePercent < 85)
                            || (pendingTasks >= 2 && pendingTasks < 4);

            if (highRisk) {
                high++;
            } else if (moderateRisk) {
                moderate++;
            } else {
                low++;
            }
        }

        return StudentRiskSummary.builder()
                .totalStudents(students.size())
                .lowRisk(low)
                .moderateRisk(moderate)
                .highRisk(high)
                .build();
    }
}
