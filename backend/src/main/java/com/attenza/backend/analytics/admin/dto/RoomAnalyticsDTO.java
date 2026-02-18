package com.attenza.backend.analytics.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomAnalyticsDTO {

    private Long roomId;
    private String roomCode;
    private String roomName;
    private int capacity;

    private long totalSessions;
    private long totalApprovedSubmissions;

    private double utilizationPercentage;
}
