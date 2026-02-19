package com.attenza.backend.ai.analyzer;

import com.attenza.backend.attendance.entity.AttendanceSubmissionStatus;
import com.attenza.backend.attendance.repository.AttendanceSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AttendanceAnalyzer {

    private final AttendanceSubmissionRepository repository;

    public double calculateFacultyAttendance(Long facultyId) {

        // count approved attendance submissions
        long approved = repository.countByStatus(
                AttendanceSubmissionStatus.APPROVED
        );

        long total = repository.count();

        if (total == 0) return 100;

        return (approved * 100.0) / total;
    }
}
