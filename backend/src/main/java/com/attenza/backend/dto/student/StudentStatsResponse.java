package com.attenza.backend.dto.student;

public record StudentStatsResponse(
        long total,
        long active,
        long warning,
        long suspended,
        double avgAttendance  
) {}