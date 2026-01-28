package com.attenza.backend.attendance.service;

import com.attenza.backend.attendance.dto.StudentAttendanceDTO;
import com.attenza.backend.attendance.entity.*;
import com.attenza.backend.attendance.repository.*;
import com.attenza.backend.timetable.entity.TimetableEntry;
import com.attenza.backend.timetable.repository.TimetableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentAttendanceService {

    private final AttendanceSubmissionRepository submissionRepository;
    private final AttendanceSessionRepository sessionRepository;
    private final TimetableRepository timetableRepository;

    public List<StudentAttendanceDTO> getStudentAttendance(Long studentId) {

        // 1️⃣ Fetch only APPROVED submissions
        List<AttendanceSubmission> approved =
                submissionRepository.findByStudentIdAndStatus(
                        studentId,
                        AttendanceSubmissionStatus.APPROVED
                );

        // 2️⃣ Keep only FINALIZED sessions
        return approved.stream()
                .filter(sub -> {
                    AttendanceSession session =
                            sessionRepository.findById(sub.getSessionId()).orElse(null);
                    return session != null
                            && session.getStatus() == AttendanceSessionStatus.FINALIZED;
                })
                .map(sub -> {
                    AttendanceSession session =
                            sessionRepository.findById(sub.getSessionId())
                                    .orElseThrow(() ->
                                            new RuntimeException("Session not found"));

                    TimetableEntry entry =
                            timetableRepository.findById(session.getClassId())
                                    .orElseThrow(() ->
                                            new RuntimeException("Timetable entry not found"));

                    // ✅ CORRECT SUBJECT RESOLUTION
                    String subjectCode =
                            entry.getCourseOffering()
                                 .getSubject()
                                 .getSubjectCode();

                    String subjectName =
                            entry.getCourseOffering()
                                 .getSubject()
                                 .getSubjectName();

                    return new StudentAttendanceDTO(
                            subjectCode,
                            subjectName,
                            session.getStartTime().toLocalDate(),
                            "PRESENT"
                    );
                })
                .collect(Collectors.toList());
    }
}
