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

    private String id;                 
    private String type;               
    private String title;              
    private String message;            
    private LocalDateTime timestamp;   
    private String actionUrl;          
    private boolean unread;            
}
