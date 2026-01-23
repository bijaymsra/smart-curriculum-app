package com.attenza.backend.dto.faculty;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FacultyLoginResponse {

    private String facultyId;
    private String fullName;
    private String email;
    private String department;
    private String institutionId;
    private String institutionName;
}
