package com.attenza.backend.attendance.repository;

import com.attenza.backend.attendance.entity.AttendanceSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceSessionRepository
        extends JpaRepository<AttendanceSession, String> {
}
