package com.attenza.backend.attendance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.*;


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
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceSubmissionStatus status;

}
