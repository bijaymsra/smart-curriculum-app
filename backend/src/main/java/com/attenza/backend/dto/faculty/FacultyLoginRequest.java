package com.attenza.backend.dto.faculty;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FacultyLoginRequest {

    @NotBlank
    private String institutionId;   // public institution ID

    @NotBlank
    private String facultyId;       // public faculty ID (FACAxxxx)

    @NotBlank
    private String password;
}
