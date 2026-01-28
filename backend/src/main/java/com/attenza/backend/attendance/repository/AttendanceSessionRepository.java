package com.attenza.backend.attendance.repository;

import com.attenza.backend.attendance.entity.AttendanceSession;
import org.springframework.data.jpa.repository.JpaRepository;
import com.attenza.backend.attendance.entity.AttendanceSessionStatus;
import com.attenza.backend.attendance.entity.AttendanceSessionStatus;
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
    List<AttendanceSession> findByStatus(AttendanceSessionStatus status);
}
