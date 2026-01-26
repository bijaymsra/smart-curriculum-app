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
    name = "student_groups",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {
                "institution_id",
                "department_id",
                "course",
                "batch",
                "semester",
                "section"
            }
        )
    }
)
@Getter
@Setter
public class StudentGroup {

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
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    /* =========================
       ACADEMIC IDENTIFIERS
       ========================= */

    @Column(nullable = false)
    private String course;          // e.g. BTech

    @Column(nullable = false)
    private String batch;           // e.g. 2023

    @Column(nullable = false)
    private Integer semester;        // e.g. 5

    @Column(nullable = false)
    private String section;          // e.g. A, B

    @Transient
    private Long studentCount;


    /* =========================
       META
       ========================= */

    @Column(name = "display_name", nullable = false)
    private String displayName;      // CSE-BTech-2023-S5-A

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /* =========================
       LIFECYCLE
       ========================= */

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        buildDisplayName();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        buildDisplayName();
    }

    private void buildDisplayName() {
        this.displayName =
            department.getDepartmentCode()
            + "-" + batch
            + " (S" + semester + "/" + section + ")";
    }

}
