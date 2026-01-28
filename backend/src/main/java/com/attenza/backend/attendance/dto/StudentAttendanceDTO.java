package com.attenza.backend.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class StudentAttendanceDTO {

    private String courseCode;
    private String courseName;
    private LocalDate date;
    private String status; // PRESENT / ABSENT
}
