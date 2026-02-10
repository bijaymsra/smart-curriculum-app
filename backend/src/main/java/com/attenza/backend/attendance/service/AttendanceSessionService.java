package com.attenza.backend.attendance.service;

import com.attenza.backend.attendance.dto.AttendanceSessionStartRequest;
import com.attenza.backend.attendance.dto.AttendanceSessionStartResponse;
import com.attenza.backend.attendance.entity.AttendanceSession;
import com.attenza.backend.attendance.repository.AttendanceSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.attenza.backend.attendance.entity.AttendanceSessionStatus;
import org.springframework.scheduling.annotation.Scheduled;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;




import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class AttendanceSessionService {

    private final AttendanceSessionRepository repository;
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();


        public AttendanceSessionStartResponse startSession(
                AttendanceSessionStartRequest request
        ) {

        Optional<AttendanceSession> existingSession =
                repository.findByFacultyIdAndClassIdAndStatus(
                        request.getFacultyId(),
                        request.getClassId(),
                        AttendanceSessionStatus.ACTIVE
                );

        if (existingSession.isPresent()) {
                AttendanceSession session = existingSession.get();

                long remainingSeconds =
                        java.time.Duration.between(
                                LocalDateTime.now(),
                                session.getExpiryTime()
                        ).getSeconds();

                remainingSeconds = Math.max(remainingSeconds, 0);

                return new AttendanceSessionStartResponse(
                        session.getSessionId(),
                        (int) remainingSeconds
                );
        }

        String sessionId =
                "ATT-" + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();

        LocalDateTime now = LocalDateTime.now();

        AttendanceSession session = AttendanceSession.builder()
                .sessionId(sessionId)
                .facultyId(request.getFacultyId())
                .classId(request.getClassId())
                .startTime(now)
                .expiryTime(now.plusMinutes(2))
                .status(AttendanceSessionStatus.ACTIVE)
                .phase(1)
                .build();

        repository.save(session);

        return new AttendanceSessionStartResponse(sessionId, 120);
        }



        public SseEmitter registerEmitter(String sessionId) {

        SseEmitter emitter = new SseEmitter(0L); // no timeout

        emitters.put(sessionId, emitter);

        emitter.onCompletion(() -> emitters.remove(sessionId));
        emitter.onTimeout(() -> emitters.remove(sessionId));
        emitter.onError(e -> emitters.remove(sessionId));

        return emitter;
        }

        public void pushSubmission(
        String sessionId,
        Object payload
        ) {
        SseEmitter emitter = emitters.get(sessionId);
        if (emitter != null) {
                try {
                emitter.send(payload);
                } catch (Exception e) {
                emitters.remove(sessionId);
                }
        }
        }

        public void testPush(String sessionId) {
        pushSubmission(sessionId, Map.of(
                "studentId", 1,
                "studentName", "Test Student",
                "status", "SUBMITTED",
                "time", "Now"
        ));
        }

        @Scheduled(fixedRate = 60_000) // runs every 1 minute
        public void expireSessions() {

        List<AttendanceSession> activeSessions =
                repository.findByStatus(AttendanceSessionStatus.ACTIVE);

        LocalDateTime now = LocalDateTime.now();

        for (AttendanceSession session : activeSessions) {
                if (session.getExpiryTime().isBefore(now)) {
                session.setStatus(AttendanceSessionStatus.EXPIRED);
                repository.save(session);
                }
        }
        }


        @Transactional
        public void completeSession(String sessionId) {

        AttendanceSession session = repository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.getStatus() != AttendanceSessionStatus.ACTIVE) {
                throw new RuntimeException("Only ACTIVE sessions can be completed");
        }

        session.setStatus(AttendanceSessionStatus.COMPLETED);
        repository.save(session);
        }

        @Transactional
        public void cancelSession(String sessionId) {

        AttendanceSession session = repository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.getStatus() != AttendanceSessionStatus.ACTIVE) {
                throw new RuntimeException("Only ACTIVE sessions can be cancelled");
        }

        session.setStatus(AttendanceSessionStatus.CANCELLED);
        repository.save(session);
        }


        public AttendanceSession getActiveSession(String sessionId) {

        AttendanceSession session = repository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.getStatus() != AttendanceSessionStatus.ACTIVE) {
                throw new RuntimeException("Session not active");
        }

        return session;
        }



        public void pushReviewUpdate(String sessionId, Object payload) {
        SseEmitter emitter = emitters.get(sessionId);
        if (emitter != null) {
                try {
                emitter.send(payload);
                } catch (Exception e) {
                emitters.remove(sessionId);
                }
        }
        }

}