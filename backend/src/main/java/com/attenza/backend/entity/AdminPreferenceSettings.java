package com.attenza.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin_preference_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminPreferenceSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // UI Preferences
    private String theme = "dark";   // dark | light
    private String language = "en";  // future-proof
    private String timezone = "Asia/Kolkata";

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false, unique = true)
    @JsonIgnore
    private AdminUser admin;
}
