package com.attenza.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@Entity
@Table(name = "subjects")
@JsonIgnoreProperties({
    "hibernateLazyInitializer",
    "handler",
    "department"
})
@Getter
@Setter
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subject_code", unique = true, nullable = false)
    private String subjectCode; 

    @Column(name = "subject_name", nullable = false)
    private String subjectName;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer credits;
    private Integer semester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Transient
    public Long getDepartmentId() {
        return department != null ? department.getId() : null;
    }

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