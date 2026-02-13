package com.attenza.backend.notification.controller;

import com.attenza.backend.notification.dto.NotificationDTO;
import com.attenza.backend.notification.service.FacultyNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/faculty/notifications")
@RequiredArgsConstructor
public class FacultyNotificationController {

    private final FacultyNotificationService notificationService;

@GetMapping("/me")
public List<NotificationDTO> getMyNotifications(
        Authentication authentication
) {

    String facultyId = authentication.getName();

    return notificationService.getFacultyNotifications(facultyId);
}


}
