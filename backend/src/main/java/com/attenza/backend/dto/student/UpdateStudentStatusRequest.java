package com.attenza.backend.dto.student;

import com.attenza.backend.entity.StudentStatus;

public record UpdateStudentStatusRequest(
        StudentStatus status,
        String reason // optional (for suspension / rejection)
) {}
