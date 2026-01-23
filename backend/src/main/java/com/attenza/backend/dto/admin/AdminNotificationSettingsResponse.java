package com.attenza.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminNotificationSettingsResponse {
    private boolean emailNotifications;
    private boolean pushNotifications;
    private boolean attendanceAlerts;
    private boolean systemUpdates;
    private boolean weeklyReports;
}
