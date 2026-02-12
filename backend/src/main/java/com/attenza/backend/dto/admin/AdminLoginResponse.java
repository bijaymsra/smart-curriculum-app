package com.attenza.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminLoginResponse {
    private String token; 
    private Long adminId;
    private String email;
    private String fullName;
    private String institutionName;
    private String status;
    private Long institutionId;  
}