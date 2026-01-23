package com.attenza.backend.dto.admin;
import lombok.Data;

@Data
public class AdminNotificationSettingsRequest {
    private boolean emailNotifications;
    private boolean pushNotifications;
    private boolean attendanceAlerts;
    private boolean systemUpdates;
    private boolean weeklyReports;
}
