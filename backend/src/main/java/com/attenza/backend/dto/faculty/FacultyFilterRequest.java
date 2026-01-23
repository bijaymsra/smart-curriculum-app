package com.attenza.backend.dto.faculty;

import lombok.Data;

@Data
public class FacultyFilterRequest {
    private String status;
    private String departmentCode;
    private String utilizationRange; // high, medium, low
    private String searchTerm;
}