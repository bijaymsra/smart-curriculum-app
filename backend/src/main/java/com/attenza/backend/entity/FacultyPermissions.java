package com.attenza.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "faculty_permissions")
@Getter
@Setter
public class FacultyPermissions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    @Column(name = "attendance_access")
    private Boolean attendanceAccess = false;

    @Column(name = "student_management")
    private Boolean studentManagement = false;

    @Column(name = "marks_entry")
    private Boolean marksEntry = false;

    @Column(name = "course_creation")
    private Boolean courseCreation = false;

    @Column(name = "exam_management")
    private Boolean examManagement = false;

    @Column(name = "leave_approval")
    private Boolean leaveApproval = false;

    @Column(name = "notice_board_access")
    private Boolean noticeBoardAccess = true;

    @Column(name = "analytics_access")
    private Boolean analyticsAccess = false;

    @Column(name = "admin_access")
    private Boolean adminAccess = false;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

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