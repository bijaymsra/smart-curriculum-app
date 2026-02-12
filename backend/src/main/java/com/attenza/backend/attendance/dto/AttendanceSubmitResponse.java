package com.attenza.backend.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class AttendanceSubmitResponse {

    private String message;
    private String sessionId;
    private Long studentId;
    private String status;
}
