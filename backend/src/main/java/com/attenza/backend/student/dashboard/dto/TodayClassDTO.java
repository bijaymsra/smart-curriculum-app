package com.attenza.backend.student.dashboard.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;

@Data
@Builder
public class TodayClassDTO {

    private Long timetableId;
    private String subjectCode;
    private String subjectName;
    private String facultyName;
    private String roomCode;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status; // UPCOMING | LIVE | COMPLETED
}
