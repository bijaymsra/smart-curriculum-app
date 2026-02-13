package com.attenza.backend.attendance.service;

import com.attenza.backend.attendance.dto.StudentAttendanceDTO;
import com.attenza.backend.attendance.entity.AttendanceSession;
import com.attenza.backend.attendance.entity.AttendanceSessionStatus;
import com.attenza.backend.attendance.entity.AttendanceSubmission;
import com.attenza.backend.attendance.entity.AttendanceSubmissionStatus;
import com.attenza.backend.attendance.repository.AttendanceSessionRepository;
import com.attenza.backend.attendance.repository.AttendanceSubmissionRepository;
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

        // 1️⃣ Fetch ALL submissions for the student
        List<AttendanceSubmission> allSubmissions = 
                submissionRepository.findByStudentId(studentId);

        return allSubmissions.stream()
                .filter(sub -> {
                        // 2️⃣ Check if the session is FINALIZED
                        AttendanceSession session = 
                                sessionRepository.findById(sub.getSessionId()).orElse(null);
                        
                        return session != null 
                                && session.getStatus() == AttendanceSessionStatus.FINALIZED;
                })
                .map(sub -> {
                        AttendanceSession session = sessionRepository.findById(sub.getSessionId())
                                .orElseThrow(() -> new RuntimeException("Session not found"));

                        TimetableEntry entry = timetableRepository.findById(session.getClassId())
                                .orElseThrow(() -> new RuntimeException("Timetable entry not found"));

                        // 3️⃣ Logic: Only APPROVED counts as PRESENT. 
                        // Everything else (REJECTED, FLAGGED) results in ABSENT.
                        String finalStatus = (sub.getStatus() == AttendanceSubmissionStatus.APPROVED) 
                                        ? "PRESENT" 
                                        : "ABSENT";

                        return new StudentAttendanceDTO(
                                entry.getCourseOffering().getSubject().getSubjectCode(),
                                entry.getCourseOffering().getSubject().getSubjectName(),
                                session.getStartTime().toLocalDate(),
                                finalStatus
                        );
                })
                .collect(Collectors.toList());
        }

}
