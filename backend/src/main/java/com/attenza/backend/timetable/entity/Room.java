package com.attenza.backend.timetable.entity;

import com.attenza.backend.entity.Department;
import com.attenza.backend.entity.Institution;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


import java.time.LocalDateTime;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(
    name = "rooms",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {
                "institution_id",
                "room_code"
            }
        )
    }
)
@Getter
@Setter
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* =========================
       INSTITUTION CONTEXT
       ========================= */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false)
    private Institution institution;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department; // nullable → common rooms

    /* =========================
       ROOM DETAILS
       ========================= */

    @Column(name = "room_code", nullable = false)
    private String roomCode; // e.g. CSE-204, LAB-1

    @Column(name = "room_name")
    private String roomName; // Optional descriptive name

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "room_type", nullable = false)
    private String roomType; // CLASSROOM, LAB, AUDITORIUM

    /* =========================
       META
       ========================= */

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /* =========================
       LIFECYCLE
       ========================= */

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
