package com.attenza.backend.analytics.controller;

import com.attenza.backend.analytics.dto.FacultyAnalyticsResponse;
import com.attenza.backend.analytics.service.FacultyAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/faculty/analytics")
@RequiredArgsConstructor
public class FacultyAnalyticsController {

    private final FacultyAnalyticsService analyticsService;

    @GetMapping("/me")
    public ResponseEntity<FacultyAnalyticsResponse> getMyAnalytics(
            Authentication authentication
    ) {

        String facultyId = authentication.getName();

        return ResponseEntity.ok(
                analyticsService.getFacultyAnalytics(facultyId)
        );
    }
}
