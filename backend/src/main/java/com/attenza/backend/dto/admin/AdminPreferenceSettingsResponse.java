package com.attenza.backend.dto.admin;

import lombok.Data;

@Data
public class AdminPreferenceSettingsResponse {
    private String theme;
    private String language;
    private String timezone;
}
