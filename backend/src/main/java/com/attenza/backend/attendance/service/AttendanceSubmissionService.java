package com.attenza.backend.attendance.service;

import com.attenza.backend.attendance.dto.AttendanceSubmitRequest;
import com.attenza.backend.attendance.entity.AttendanceSession;
import com.attenza.backend.attendance.entity.AttendanceSubmission;
import com.attenza.backend.attendance.entity.AttendanceSessionStatus;
import com.attenza.backend.attendance.entity.AttendanceSubmissionStatus;
import com.attenza.backend.attendance.repository.AttendanceSessionRepository;
import com.attenza.backend.attendance.repository.AttendanceSubmissionRepository;
import com.attenza.backend.entity.Student;
import com.attenza.backend.repository.admin.StudentRepository;
import com.attenza.backend.timetable.entity.StudentGroup;
import com.attenza.backend.timetable.entity.TimetableEntry;
import com.attenza.backend.timetable.repository.TimetableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AttendanceSubmissionService {

    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceSubmissionRepository submissionRepository;
    private final AttendanceSessionService sessionService;
    private final StudentRepository studentRepository;
    private final TimetableRepository timetableRepository;
    private final AttendanceQrTokenService qrTokenService;


   @Transactional
   public void submitAttendance(AttendanceSubmitRequest request) {

      /* =========================
         1. Validate & extract session
         ========================= */

      String sessionId = qrTokenService.verifyAndExtractSessionId(
               request.getQrToken()
      );

      AttendanceSession session = sessionRepository
               .findById(sessionId)
               .orElseThrow(() -> new RuntimeException("Invalid attendance session"));

      if (session.getStatus() == AttendanceSessionStatus.FINALIZED) {
         throw new RuntimeException("Attendance session already finalized");
      }

      if (session.getStatus() != AttendanceSessionStatus.ACTIVE) {
         throw new RuntimeException("Attendance session is not active");
      }

      if (session.getExpiryTime().isBefore(LocalDateTime.now())) {
         throw new RuntimeException("Attendance session expired");
      }

      /* =========================
         2. Validate student
         ========================= */

      Student student = studentRepository
               .findById(request.getStudentId())
               .orElseThrow(() -> new RuntimeException("Invalid student"));

      /* =========================
         3. Validate timetable/class
         ========================= */

      TimetableEntry timetableEntry = timetableRepository
               .findById(session.getClassId())
               .orElseThrow(() -> new RuntimeException("Invalid class for attendance"));

      StudentGroup group = timetableEntry.getStudentGroup();

      boolean belongs =
               student.getInstitution().getId().equals(group.getInstitution().getId())
                     && student.getDepartment().equals(group.getDepartment().getDepartmentCode())
                     && student.getCourse().equals(group.getCourse())
                     && student.getBatch().equals(group.getBatch())
                     && student.getSemester().equals(group.getSemester())
                     && student.getSection().equals(group.getSection());

      if (!belongs) {
         throw new RuntimeException("Student not allowed for this class");
      }

      /* =========================
         4. Prevent duplicate submission
         ========================= */

      boolean alreadySubmitted =
               submissionRepository.existsBySessionIdAndStudentId(
                     session.getSessionId(),
                     student.getId()
               );

      if (alreadySubmitted) {
         throw new RuntimeException("Attendance already submitted");
      }

      /* =========================
         5. Save submission as PENDING
         ========================= */

      AttendanceSubmission submission = AttendanceSubmission.builder()
               .sessionId(session.getSessionId())
               .studentId(student.getId())
               .studentName(student.getFullName())
               .submittedAt(LocalDateTime.now())
               .status(AttendanceSubmissionStatus.PENDING) // 🔥 important change
               .build();

      submissionRepository.save(submission);

      /* =========================
         6. Push live update to faculty UI
         ========================= */

      sessionService.pushSubmission(session.getSessionId(), submission);
   }


}
