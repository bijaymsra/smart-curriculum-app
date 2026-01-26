package com.attenza.backend.timetable.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseOfferingRequest {

    private Long studentGroupId;
    private Long subjectId;
    private Long facultyId;
}
