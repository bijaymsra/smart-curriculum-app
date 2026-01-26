package com.attenza.backend.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubjectCreateRequest {

    private String subjectCode;
    private String subjectName;
    private Integer credits;
    private Integer semester;
    private Long departmentId;
}
