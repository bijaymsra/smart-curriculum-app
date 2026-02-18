package com.attenza.backend.student.tasks.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StudentTaskListResponse {

    private List<StudentTaskResponse> tasks;
    private StudentTaskStatsDTO stats;
}
