package com.attenza.backend.attendance.controller;

import com.attenza.backend.attendance.dto.StudentAttendanceDTO;
import com.attenza.backend.attendance.service.StudentAttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/attendance")
@RequiredArgsConstructor
public class StudentAttendanceController {

    private final StudentAttendanceService attendanceService;

    @GetMapping
    public List<StudentAttendanceDTO> getMyAttendance(
            Authentication authentication
    ) {
        Long studentId = Long.parseLong(authentication.getName());
        return attendanceService.getStudentAttendance(studentId);
    }
}
