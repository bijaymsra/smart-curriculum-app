package com.attenza.backend.dto.faculty;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FacultyInsightDTO {

    private String type;
    private String title;
    private String message;
    private String action;
}
