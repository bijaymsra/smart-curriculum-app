package com.attenza.backend.attendance.repository;

import com.attenza.backend.attendance.entity.AttendanceSubmission;
import com.attenza.backend.attendance.entity.AttendanceSubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttendanceSubmissionRepository
        extends JpaRepository<AttendanceSubmission, Long> {


    List<AttendanceSubmission> findByStudentId(Long studentId);
    
    // Prevent duplicate submission (Phase 1 & 2)
    boolean existsBySessionIdAndStudentId(
            String sessionId,
            Long studentId
    );

    // Fetch all submissions of a session (faculty view)
    List<AttendanceSubmission> findBySessionId(String sessionId);

    // Student attendance (FINALIZED + APPROVED only)
    List<AttendanceSubmission> findByStudentIdAndStatus(
            Long studentId,
            AttendanceSubmissionStatus status
    );

    // Phase-2 random check validation
    boolean existsBySessionIdAndStudentIdAndStatus(
            String sessionId,
            Long studentId,
            AttendanceSubmissionStatus status
    );

    long countByStatus(AttendanceSubmissionStatus status);

    List<AttendanceSubmission> findByStatus(
        AttendanceSubmissionStatus status);


        long countByStudentIdAndStatus(
    Long studentId,
    AttendanceSubmissionStatus status
);


}
