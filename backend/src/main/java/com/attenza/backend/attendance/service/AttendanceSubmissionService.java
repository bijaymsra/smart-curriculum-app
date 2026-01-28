package com.attenza.backend.attendance.service;

import com.attenza.backend.attendance.dto.AttendanceSubmitRequest;
import com.attenza.backend.attendance.entity.AttendanceSession;
import com.attenza.backend.attendance.entity.AttendanceSubmission;
import com.attenza.backend.attendance.repository.AttendanceSessionRepository;
import com.attenza.backend.attendance.repository.AttendanceSubmissionRepository;
import com.attenza.backend.entity.Student;
import com.attenza.backend.repository.admin.StudentRepository;
import com.attenza.backend.timetable.entity.StudentGroup;
import com.attenza.backend.timetable.entity.TimetableEntry;
import com.attenza.backend.timetable.repository.TimetableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.attenza.backend.attendance.entity.AttendanceSubmissionStatus;
import com.attenza.backend.attendance.entity.AttendanceSessionStatus;
import com.attenza.backend.attendance.service.AttendanceQrTokenService;


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


    public void submitAttendance(AttendanceSubmitRequest request) {

        /* =========================
           1. Validate session
           ========================= */


         String sessionId = qrTokenService.verifyAndExtractSessionId(
               request.getQrToken()
         );

         AttendanceSession session = sessionRepository
               .findById(sessionId)
               .orElseThrow(() -> new RuntimeException("Invalid attendance session"));

         if (session.getStatus() == AttendanceSessionStatus.FINALIZED) {
            throw new RuntimeException("Attendance already finalized");
         }

         if (session.getStatus() != AttendanceSessionStatus.ACTIVE
               || session.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Attendance session expired");
         }



        /* =========================
           2. Validate student
           ========================= */

        Student student = studentRepository
                .findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Invalid student"));

        /* =========================
           3. Resolve timetable entry
           ========================= */

        TimetableEntry timetableEntry = timetableRepository
                .findById(session.getClassId())
                .orElseThrow(() -> new RuntimeException("Invalid class for attendance"));

        StudentGroup group = timetableEntry.getStudentGroup();

        /* =========================
           4. Dynamic StudentGroup validation
           ========================= */

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
           5. Prevent duplicate
           ========================= */

        if (submissionRepository.existsBySessionIdAndStudentId(
                session.getSessionId(),
                student.getId()
        )) {
            throw new RuntimeException("Attendance already submitted");
        }

        /* =========================
           6. Save submission
           ========================= */

        AttendanceSubmission submission = new AttendanceSubmission();
        submission.setSessionId(session.getSessionId());
        submission.setStudentId(student.getId());
        submission.setStudentName(student.getFullName());
        submission.setSubmittedAt(LocalDateTime.now());



         // Phase-1 → only verification
      if (session.getPhase() == 1) {
         submission.setPhase1Verified(true);
         submission.setPhase2Verified(false);
         submission.setStatus(AttendanceSubmissionStatus.APPROVED);
      } else {
         throw new RuntimeException("Phase-1 submission window closed");
      }


            /* =========================
            5.5 Phase-2 validation
            ========================= */

         if (session.getPhase() == 2) {

            boolean approvedInPhase1 =
               submissionRepository
                     .findBySessionId(session.getSessionId())
                     .stream()
                     .anyMatch(s ->
                        s.getStudentId().equals(student.getId()) &&
                        s.getStatus() == AttendanceSubmissionStatus.APPROVED
                     );

            if (!approvedInPhase1) {
               throw new RuntimeException(
                     "Student did not clear Phase 1 attendance"
               );
            }
         }


        submissionRepository.save(submission);

        /* =========================
           7. Push to faculty UI (SSE)
           ========================= */

        sessionService.pushSubmission(session.getSessionId(), submission);
    }
}
