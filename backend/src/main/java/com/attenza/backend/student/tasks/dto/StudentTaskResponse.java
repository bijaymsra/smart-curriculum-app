package com.attenza.backend.student.tasks.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
public class StudentTaskResponse {

    private Long id;

    private String title;
    private String description;

    private LocalDate dueDate;
    private LocalTime dueTime;

    private String priority;
    private String category;

    private Integer estimatedTime;
    private Integer points;

    private Boolean completed;
    private LocalDateTime completedAt;

    private Boolean overdue;

    private LocalDateTime createdAt;
}
