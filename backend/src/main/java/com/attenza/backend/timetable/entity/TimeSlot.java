package com.attenza.backend.timetable.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(
    name = "time_slots",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {
            "day_of_week",
            "start_time",
            "end_time"
        })
    }
)
@Getter
@Setter
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* =========================
       TIME DEFINITION
       ========================= */

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    private DayOfWeek dayOfWeek;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    /* =========================
       META
       ========================= */

    @Column(name = "label", nullable = false)
    private String label; // e.g. "MON 09:00 - 10:00"

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /* =========================
       LIFECYCLE
       ========================= */

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        buildLabel();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        buildLabel();
    }

    private void buildLabel() {
        this.label =
            dayOfWeek.name().substring(0, 3) + " " +
            startTime + " - " +
            endTime;
    }
}
