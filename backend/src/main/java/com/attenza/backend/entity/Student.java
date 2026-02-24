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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_id", unique = true, nullable = false)
    private String publicId;

    @Column(name = "registration_no", unique = true, nullable = false)
    private String registrationNo;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    private String phone;

    private String gender;

    private LocalDate dateOfBirth;

   
    @Column(name = "password_hash")
    private String passwordHash;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StudentStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false)
    private Institution institution;

    private String course;

    private String department;

    private String batch;

    private Integer semester;

    private String section;

    private String rollNo;

    private String admissionType;

    private Integer attendancePercentage = 0;

    @Column(length = 500)
    private String address;

    private String city;

    private String state;

    private String guardianName;

    private String guardianPhone;

    private LocalDate joinedDate;

    private LocalDateTime lastActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

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
