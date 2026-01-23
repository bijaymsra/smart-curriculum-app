package com.attenza.backend.dto.admin;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private Long adminId;
    private String currentPassword;
    private String newPassword;
}
