package com.attenza.backend.attendance.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceSessionStartRequest {
    private String facultyId;
    private Long classId;
}
