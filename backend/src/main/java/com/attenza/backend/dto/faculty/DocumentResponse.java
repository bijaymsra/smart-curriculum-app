package com.attenza.backend.dto.faculty;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DocumentResponse {
    private Long id;
    private String documentName;
    private String documentType;
    private String category;
    private Long fileSize;
    private LocalDateTime uploadedAt;
    private Boolean verified;
    private String verifiedByAdminId;
    private LocalDateTime verificationDate;
}