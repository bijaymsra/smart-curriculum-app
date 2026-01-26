package com.attenza.backend.dto.admin;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SubjectResponse {

    private Long id;
    private String subjectCode;
    private String subjectName;
    private Integer credits;
    private Integer semester;
    private String departmentName;
}
