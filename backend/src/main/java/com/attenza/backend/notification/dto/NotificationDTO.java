package com.attenza.backend.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private String id;                 // unique id (can be UUID or generated)
    private String type;               // INFO | WARNING | ALERT
    private String title;              // Short heading
    private String message;            // Detailed message
    private LocalDateTime timestamp;   // When generated
    private String actionUrl;          // Optional redirect link
    private boolean unread;            // For badge count (future-ready)
}
