package com.attenza.backend.attendance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import com.attenza.backend.attendance.entity.AttendanceSubmissionStatus;

@Entity
@Table(
    name = "attendance_submissions",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"session_id", "student_id"})
    }
)
@Getter
@Setter
public class AttendanceSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false)
    private String sessionId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;



    /* =========================
    PHASE TRACKING
    ========================= */

    @Column(name = "phase1_verified", nullable = false)
    private boolean phase1Verified = false;

    @Column(name = "phase2_verified", nullable = false)
    private boolean phase2Verified = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceSubmissionStatus status;

}
