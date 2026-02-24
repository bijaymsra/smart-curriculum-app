package com.attenza.backend.notification.service;

import com.attenza.backend.notification.dto.NotificationDTO;
import com.attenza.backend.attendance.repository.AttendanceSessionRepository;
import com.attenza.backend.attendance.repository.AttendanceSubmissionRepository;
import com.attenza.backend.attendance.entity.AttendanceSession;
import com.attenza.backend.attendance.entity.AttendanceSessionStatus;
import com.attenza.backend.attendance.entity.AttendanceSubmissionStatus;
import com.attenza.backend.timetable.repository.TimetableRepository;
import com.attenza.backend.timetable.entity.TimetableEntry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FacultyNotificationService {

    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceSubmissionRepository submissionRepository;
    private final TimetableRepository timetableRepository;

    public List<NotificationDTO> getFacultyNotifications(String facultyId) {

        List<NotificationDTO> notifications = new ArrayList<>();

        List<AttendanceSession> sessions =
                sessionRepository.findByFacultyIdAndStatus(
                        facultyId,
                        AttendanceSessionStatus.EXPIRED
                );

        for (AttendanceSession session : sessions) {

            notifications.add(
                    NotificationDTO.builder()
                            .id(UUID.randomUUID().toString())
                            .type("ALERT")
                            .title("Attendance Not Finalized")
                            .message("Session " + session.getSessionId() +
                                    " expired but not finalized.")
                            .timestamp(LocalDateTime.now())
                            .actionUrl("/faculty/attendance")
                            .unread(true)
                            .build()
            );
        }

        long flaggedCount =
                submissionRepository.countByStatus(
                        AttendanceSubmissionStatus.FLAGGED
                );

        if (flaggedCount > 0) {
            notifications.add(
                    NotificationDTO.builder()
                            .id(UUID.randomUUID().toString())
                            .type("WARNING")
                            .title("Flagged Attendance Pending")
                            .message(flaggedCount +
                                    " flagged attendance entries need review.")
                            .timestamp(LocalDateTime.now())
                            .actionUrl("/faculty/attendance")
                            .unread(true)
                            .build()
            );
        }

        List<TimetableEntry> todayClasses =
                timetableRepository.findByFaculty_FacultyId(facultyId);

        for (TimetableEntry entry : todayClasses) {

            notifications.add(
                    NotificationDTO.builder()
                            .id(UUID.randomUUID().toString())
                            .type("INFO")
                            .title("Upcoming Class")
                            .message(entry.getCourseOffering()
                                    .getSubject()
                                    .getSubjectName()
                                    + " scheduled today.")
                            .timestamp(LocalDateTime.now())
                            .actionUrl("/faculty/attendance")
                            .unread(true)
                            .build()
            );
        }

        return notifications;
    }
}
