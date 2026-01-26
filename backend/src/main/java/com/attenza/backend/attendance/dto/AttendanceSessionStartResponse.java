package com.attenza.backend.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AttendanceSessionStartResponse {
    private String sessionId;
    private int expiresIn; // seconds
}
