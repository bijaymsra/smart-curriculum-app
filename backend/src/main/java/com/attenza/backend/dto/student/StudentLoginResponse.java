package com.attenza.backend.dto.student;

public record StudentLoginResponse(
        Long studentId,
        String fullName,
        String registrationNo,
        String status,
        String institutionName,
        String institutionPublicId  
) {}