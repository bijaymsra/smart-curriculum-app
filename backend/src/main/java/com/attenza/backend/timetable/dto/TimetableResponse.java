package com.attenza.backend.timetable.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TimetableResponse {

    private Long timetableId;

    private String subjectCode;
    private String subjectName;

    private String facultyId;
    private String facultyName;

    private String section;
    private Integer semester;
    private String batch;

    private String day;
    private String time;

    private String roomCode;
    private Integer totalStudents;
}
