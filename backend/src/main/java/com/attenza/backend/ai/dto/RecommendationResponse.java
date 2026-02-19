package com.attenza.backend.ai.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecommendationResponse {

    private String type;      // FACULTY / STUDENT / ADMIN
    private String message;
    private String severity;  // INFO / SUGGESTION / ALERT
}
