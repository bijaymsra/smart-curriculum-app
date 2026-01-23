package com.attenza.backend.dto.student;

import com.attenza.backend.entity.StudentStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record StudentResponse(
        Long id,
        String publicId,
        String registrationNo,
        String rollNo,
        String fullName,
        String email,
        String phone,
        String gender,
        LocalDate dateOfBirth,

        String department,
        String course,
        String batch,
        Integer semester,
        String section,
        String admissionType,

        Integer attendancePercentage,
        StudentStatus status,

        String address,
        String city,
        String state,

        String guardianName,
        String guardianPhone,

        LocalDate joinedDate,
        LocalDateTime lastActive,
        Boolean hasCredentials   
) {}
