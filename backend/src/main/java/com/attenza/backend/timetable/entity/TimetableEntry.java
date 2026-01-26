package com.attenza.backend.timetable.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(
    name = "timetable_entries",
    uniqueConstraints = {

        // ❌ Section clash
        @UniqueConstraint(
            columnNames = {
                "student_group_id",
                "time_slot_id"
            }
        ),

        // ❌ Faculty clash
        @UniqueConstraint(
            columnNames = {
                "faculty_id",
                "time_slot_id"
            }
        ),

        // ❌ Room clash
        @UniqueConstraint(
            columnNames = {
                "room_id",
                "time_slot_id"
            }
        )
    }
)
@Getter
@Setter
public class TimetableEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* =========================
       CORE LINKS
       ========================= */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_offering_id", nullable = false)
    private CourseOffering courseOffering;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_group_id", nullable = false)
    private StudentGroup studentGroup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    private com.attenza.backend.entity.Faculty faculty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "time_slot_id", nullable = false)
    private TimeSlot timeSlot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

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

@Transient
public Long getStudentGroupId() {
    return studentGroup != null ? studentGroup.getId() : null;
}

@Transient
public Long getFacultyId() {
    return faculty != null ? faculty.getId() : null;
}

@Transient
public Long getRoomId() {
    return room != null ? room.getId() : null;
}



}
