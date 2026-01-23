package com.attenza.backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminNotificationSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    @JsonIgnore
    private AdminUser admin;


    private boolean emailNotifications;
    private boolean pushNotifications;
    private boolean attendanceAlerts;
    private boolean systemUpdates;
    private boolean weeklyReports;

    private LocalDateTime updatedAt = LocalDateTime.now();
}
