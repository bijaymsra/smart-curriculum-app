package com.attenza.backend.dto.faculty;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TodayClassDTO {

    private Long timetableId;
    private String subjectCode;
    private String subjectName;
    private String time;
    private String roomCode;
    private Integer totalStudents;
    private String attendanceStatus;
}
