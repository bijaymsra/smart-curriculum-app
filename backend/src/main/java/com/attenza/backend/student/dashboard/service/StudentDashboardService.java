package com.attenza.backend.student.dashboard.service;

import com.attenza.backend.entity.Department;
import com.attenza.backend.entity.Student;
import com.attenza.backend.exception.BadRequestException;
import com.attenza.backend.repository.admin.StudentRepository;
import com.attenza.backend.repository.faculty.DepartmentRepository;
import com.attenza.backend.student.dashboard.dto.StudentDashboardResponse;
import com.attenza.backend.student.dashboard.dto.TodayClassDTO;
import com.attenza.backend.timetable.entity.StudentGroup;
import com.attenza.backend.timetable.entity.TimetableEntry;
import com.attenza.backend.timetable.repository.StudentGroupRepository;
import com.attenza.backend.timetable.repository.TimetableRepository;
import com.attenza.backend.attendance.repository.AttendanceSessionRepository;
import com.attenza.backend.attendance.repository.AttendanceSubmissionRepository;
import com.attenza.backend.attendance.entity.AttendanceSessionStatus;
import com.attenza.backend.attendance.entity.AttendanceSubmissionStatus;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentDashboardService {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;
    private final StudentGroupRepository studentGroupRepository;
    private final TimetableRepository timetableRepository;
    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceSubmissionRepository submissionRepository;

    public StudentDashboardResponse getDashboard(Long studentId) {

        // 1️⃣ Fetch Student
        Student student = studentRepository
                .findById(studentId)
                .orElseThrow(() -> new BadRequestException("Student not found"));

        // 2️⃣ Resolve Department
        Department department = departmentRepository
                .findByDepartmentCodeAndInstitution_Id(
                        student.getDepartment(),
                        student.getInstitution().getId()
                )
                .orElseThrow(() -> new BadRequestException("Department not found"));

        // 3️⃣ Resolve StudentGroup
        StudentGroup group = studentGroupRepository
                .findByInstitutionIdAndDepartmentIdAndCourseAndBatchAndSemesterAndSection(
                        student.getInstitution().getId(),
                        department.getId(),
                        student.getCourse(),
                        student.getBatch(),
                        student.getSemester(),
                        student.getSection()
                )
                .orElseThrow(() -> new BadRequestException("Student group not found"));

        // 4️⃣ Fetch Timetable Entries
        List<TimetableEntry> entries =
                timetableRepository.findByStudentGroup_Id(group.getId());

        List<Long> classIds =
                entries.stream().map(TimetableEntry::getId).toList();

        // 5️⃣ Attendance Calculation
        long totalSessions = classIds.isEmpty() ? 0 :
                sessionRepository.countByClassIdInAndStatus(
                        classIds,
                        AttendanceSessionStatus.FINALIZED
                );

        long attended =
                submissionRepository.countByStudentIdAndStatus(
                        student.getId(),
                        AttendanceSubmissionStatus.APPROVED
                );

        long missed = Math.max(totalSessions - attended, 0);

        int attendancePercentage =
                totalSessions == 0 ? 0 :
                        (int) ((attended * 100) / totalSessions);

        // 6️⃣ Rank Calculation (Section Based)
        int totalStudents =
                studentRepository.countByInstitution_IdAndCourseAndBatchAndSemesterAndSection(
                        student.getInstitution().getId(),
                        student.getCourse(),
                        student.getBatch(),
                        student.getSemester(),
                        student.getSection()
                );

        int rank =
                studentRepository
                        .countByInstitution_IdAndCourseAndBatchAndSemesterAndSectionAndAttendancePercentageGreaterThan(
                                student.getInstitution().getId(),
                                student.getCourse(),
                                student.getBatch(),
                                student.getSemester(),
                                student.getSection(),
                                attendancePercentage
                        ) + 1;

        // 7️⃣ Today Classes
        DayOfWeek today = LocalDate.now().getDayOfWeek();
        LocalTime now = LocalTime.now();

        List<TodayClassDTO> todayClasses = entries.stream()
                .filter(e -> e.getTimeSlot().getDayOfWeek() == today)
                .map(e -> {

                    LocalTime start = e.getTimeSlot().getStartTime();
                    LocalTime end = e.getTimeSlot().getEndTime();

                    String status =
                            now.isBefore(start) ? "UPCOMING" :
                                    now.isAfter(end) ? "COMPLETED" :
                                            "LIVE";

                    return TodayClassDTO.builder()
                            .timetableId(e.getId())
                            .subjectCode(
                                    e.getCourseOffering()
                                            .getSubject()
                                            .getSubjectCode()
                            )
                            .subjectName(
                                    e.getCourseOffering()
                                            .getSubject()
                                            .getSubjectName()
                            )
                            .facultyName(
                                    e.getFaculty().getFullName()
                            )
                            .roomCode(
                                    e.getRoom().getRoomCode()
                            )
                            .startTime(start)
                            .endTime(end)
                            .status(status)
                            .build();
                })
                .toList();

        // 8️⃣ Build Response
        return StudentDashboardResponse.builder()
                .fullName(student.getFullName())
                .registrationNo(student.getRegistrationNo())
                .department(student.getDepartment())
                .course(student.getCourse())
                .semester(student.getSemester())
                .section(student.getSection())
                .totalClasses((int) totalSessions)
                .attendedClasses((int) attended)
                .missedClasses((int) missed)
                .attendancePercentage(attendancePercentage)
                .rank(rank)
                .totalStudents(totalStudents)
                .todayClasses(todayClasses)
                .lastActive(student.getLastActive())
                .build();
    }
}
