package com.attenza.backend.attendance.service;

import com.attenza.backend.attendance.dto.AttendanceSessionStartRequest;
import com.attenza.backend.attendance.dto.AttendanceSessionStartResponse;
import com.attenza.backend.attendance.entity.AttendanceSession;
import com.attenza.backend.attendance.repository.AttendanceSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttendanceSessionService {

    private final AttendanceSessionRepository repository;

    public AttendanceSessionStartResponse startSession(
            AttendanceSessionStartRequest request
    ) {

        String sessionId =
                "ATT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        LocalDateTime now = LocalDateTime.now();

        AttendanceSession session = AttendanceSession.builder()
                .sessionId(sessionId)
                .facultyId(request.getFacultyId())
                .classId(request.getClassId())
                .startTime(now)
                .expiryTime(now.plusMinutes(2))
                .status("ACTIVE")
                .build();

        repository.save(session);

        return new AttendanceSessionStartResponse(sessionId, 120);
    }
}
