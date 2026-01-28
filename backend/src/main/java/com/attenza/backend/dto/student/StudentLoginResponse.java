package com.attenza.backend.dto.student;

public record StudentLoginResponse(
        String token,
        Long studentId,
        String fullName,
        String registrationNo,
        String status,
        String institutionName,
        String institutionPublicId  
) {}