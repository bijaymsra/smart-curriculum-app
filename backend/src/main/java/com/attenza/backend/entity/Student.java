package com.attenza.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student")
@Getter
@Setter
public class Student {

    /* =========================
       CORE IDENTITY
       ========================= */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Public, human-readable ID (used in UI, URLs)
    @Column(name = "public_id", unique = true, nullable = false)
    private String publicId;

    // University / Institution registration number
    @Column(name = "registration_no", unique = true, nullable = false)
    private String registrationNo;

    /* =========================
       BASIC PROFILE
       ========================= */

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    private String phone;

    private String gender;

    private LocalDate dateOfBirth;

    /* =========================
       ACCOUNT STATUS
       ========================= */
   
    @Column(name = "password_hash")
    private String passwordHash;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StudentStatus status;

    /* =========================
       INSTITUTION RELATION
       ========================= */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false)
    private Institution institution;

    /* =========================
       ACADEMIC DETAILS
       ========================= */

    private String course;

    private String department;

    private String batch;

    private Integer semester;

    private String section;

    private String rollNo;

    private String admissionType;

    /* =========================
       ATTENDANCE (SUMMARY)
       ========================= */

    private Integer attendancePercentage = 0;

    /* =========================
       PERSONAL / GUARDIAN DETAILS
       ========================= */

    @Column(length = 500)
    private String address;

    private String city;

    private String state;

    private String guardianName;

    private String guardianPhone;

    /* =========================
       ACTIVITY & AUDIT
       ========================= */

    // When student officially joined the institution
    private LocalDate joinedDate;

    // Last seen activity (login, attendance, etc.)
    private LocalDateTime lastActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    /* =========================
       LIFECYCLE HOOKS
       ========================= */

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.joinedDate = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
