package com.attenza.backend.attendance.controller;

import com.attenza.backend.attendance.dto.StudentAttendanceDTO;
import com.attenza.backend.attendance.service.StudentAttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/attendance")
@RequiredArgsConstructor
public class StudentAttendanceController {

    private final StudentAttendanceService attendanceService;

    @GetMapping
    public List<StudentAttendanceDTO> getMyAttendance(
            @RequestAttribute("studentId") Long studentId
    ) {
        return attendanceService.getStudentAttendance(studentId);
    }

}
