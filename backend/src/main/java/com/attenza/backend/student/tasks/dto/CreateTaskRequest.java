package com.attenza.backend.student.tasks.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateTaskRequest {

    private String title;
    private String description;

    private LocalDate dueDate;

    private String priority;    // low | medium | high
    private String category;    // assignment | project | lab | study | presentation

    private Integer estimatedTime;
}
