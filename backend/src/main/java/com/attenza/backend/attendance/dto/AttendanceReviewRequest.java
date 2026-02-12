package com.attenza.backend.attendance.dto;

import com.attenza.backend.attendance.entity.AttendanceSubmissionStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AttendanceReviewRequest {

    @NotNull
    private AttendanceSubmissionStatus status;
}
