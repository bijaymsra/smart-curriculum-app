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

    private String theme = "dark";   
    private String language = "en"; 
    private String timezone = "Asia/Kolkata";

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false, unique = true)
    @JsonIgnore
    private AdminUser admin;
}
