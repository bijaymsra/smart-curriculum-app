package com.attenza.backend.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.attenza.backend.attendance.entity.AttendanceSessionStatus;

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

    @Enumerated(EnumType.STRING)
    private AttendanceSessionStatus status;


    // phase 2
    @Column(nullable = false)
    private int phase = 1;

    @Column(name = "phase2_allowed_at")
    private LocalDateTime phase2AllowedAt;

    @Column(nullable = false)
    private boolean finalised = false;


}
