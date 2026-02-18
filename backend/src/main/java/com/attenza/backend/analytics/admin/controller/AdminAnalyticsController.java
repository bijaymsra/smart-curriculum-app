package com.attenza.backend.analytics.admin.controller;

import com.attenza.backend.analytics.admin.dto.AnalyticsDashboardResponse;
import com.attenza.backend.analytics.admin.service.AdminAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
public class AdminAnalyticsController {

    private final AdminAnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public AnalyticsDashboardResponse getDashboard(
            @RequestParam(defaultValue = "week") String range,
            Authentication authentication
    ) {

        String adminId = authentication.getName();

        return analyticsService.getDashboard(adminId, range);
    }
}
