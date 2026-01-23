package com.attenza.backend.dto.student;

import jakarta.validation.constraints.NotBlank;

public record StudentLoginRequest(
        @NotBlank String registrationNo,
        @NotBlank String password,
        @NotBlank String institutionId  
) {}