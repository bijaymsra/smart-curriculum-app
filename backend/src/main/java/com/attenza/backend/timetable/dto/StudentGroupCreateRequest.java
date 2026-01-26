package com.attenza.backend.timetable.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentGroupCreateRequest {

    private Long institutionId;
    private Long departmentId;

    private String course;
    private String batch;
    private Integer semester;
    private String section;
}
