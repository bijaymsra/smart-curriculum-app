package com.attenza.backend.attendance.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceSubmitRequest {
    private String qrToken;   
    private Long studentId;
}
