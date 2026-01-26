package com.attenza.backend.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceSession {

    @Id
    @Column(length = 50)
    private String sessionId;

    @Column(nullable = false)
    private Long classId;

    @Column(nullable = false)
    private String facultyId;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime expiryTime;

    @Column(nullable = false)
    private String status; // ACTIVE, COMPLETED, CANCELLED
}
