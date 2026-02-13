package com.attenza.backend.attendance.repository;

import com.attenza.backend.attendance.entity.AttendanceSession;
import com.attenza.backend.attendance.entity.AttendanceSessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AttendanceSessionRepository
        extends JpaRepository<AttendanceSession, String> {

    Optional<AttendanceSession>
    findByFacultyIdAndClassIdAndStatus(
            String facultyId,
            Long classId,
            AttendanceSessionStatus status
    );

    List<AttendanceSession> findByStatus(
            AttendanceSessionStatus status
    );

    Optional<AttendanceSession>
    findTopByClassIdOrderByStartTimeDesc(Long classId);

    long countByFacultyIdAndStatus(
            String facultyId,
            AttendanceSessionStatus status
    );

    boolean existsByFacultyIdAndExpiryTimeAfter(
            String facultyId,
            LocalDateTime time
    );

    List<AttendanceSession> findByFacultyIdAndStatus(
            String facultyId,
            AttendanceSessionStatus status
    );
}

