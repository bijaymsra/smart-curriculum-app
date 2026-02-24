package com.attenza.backend.entity;

import com.attenza.backend.entity.enums.Gender;
import com.attenza.backend.entity.enums.FacultyStatus;
import com.attenza.backend.entity.enums.EmploymentType;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "faculty")
@JsonIgnoreProperties({
    "hibernateLazyInitializer",
    "handler",
    "institution",
    "department",
    "subjects"
})
@Getter
@Setter
public class Faculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_id", nullable = false, unique = true, updatable = false)
    private String publicId;

    @Column(name = "faculty_id", unique = true, nullable = false)
    private String facultyId; 

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String phone;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "blood_group")
    private String bloodGroup;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String city;
    private String state;
    private String pincode;

    @Column(name = "emergency_contact")
    private String emergencyContact;


   @Column(name = "alternate_phone")
   private String alternatePhone;

   @Column(name = "marital_status")
   private String maritalStatus; 

   @Column(name = "nationality")
   private String nationality;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "designation")
    private String designation; 

    @Column(name = "qualification")
    private String qualification; 


   @Column(name = "institution_name")
   private String institutionName;

   @Column(name = "year_of_passing")
   private Integer yearOfPassing;

    @Column(name = "specialization")
    private String specialization;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "research_area")
    private String researchArea;

    @Column(name = "join_date")
    private LocalDate joinDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type")
    private EmploymentType employmentType;

    @Column(name = "salary_grade")
    private String salaryGrade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FacultyStatus status = FacultyStatus.ACTIVE;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "credentials_sent")
    private Boolean credentialsSent = false;


    @Column(name = "account_locked")
    private Boolean accountLocked = false;

    @Column(name = "failed_login_attempts")
    private Integer failedLoginAttempts = 0;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false)
    private Institution institution;

    @Column(name = "utilization_percentage")
    private Integer utilizationPercentage = 0;

    @Column(name = "punctuality_percentage")
    private Integer punctualityPercentage = 0;

    @Column(name = "performance_score")
    private Integer performanceScore = 0;

    @Column(name = "attendance_percentage")
    private Integer attendancePercentage = 0;

    @Column(name = "rating")
    private Double rating = 0.0;


    @Column(name = "weekly_workload_hours")
    private Integer weeklyWorkloadHours = 0;

    @Column(name = "idle_hours")
    private Integer idleHours = 0;

    @Column(name = "leaves_taken")
    private Integer leavesTaken = 0;

    @Column(name = "leaves_available")
    private Integer leavesAvailable = 0;


   @Column(name = "max_workload_hours")
   private Integer maxWorkloadHours = 40;

   @Column(name = "medical_leaves_available")
   private Integer medicalLeavesAvailable = 0;

   @Column(name = "casual_leaves_available")
   private Integer casualLeavesAvailable = 0;


    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "ifsc_code")
    private String ifscCode;

    @Column(name = "pan_number")
    private String panNumber;

    @Column(name = "uan_number")
    private String uanNumber; 

    @Column(name = "research_papers_count")
    private Integer researchPapersCount = 0;

    @Column(name = "conferences_attended")
    private Integer conferencesAttended = 0;

    @Column(name = "projects_completed")
    private Integer projectsCompleted = 0;

    @Column(name = "publications_count")
    private Integer publicationsCount = 0;

    @Column(name = "last_active")
    private LocalDateTime lastActive;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany
    @JoinTable(
        name = "faculty_subjects",
        joinColumns = @JoinColumn(name = "faculty_id"),
        inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private Set<Subject> subjects = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.publicId == null) {
            this.publicId = "FAC-" + UUID.randomUUID()
                    .toString()
                    .substring(0, 8)
                    .toUpperCase();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public String getInitials() {
        if (fullName == null || fullName.trim().isEmpty()) {
            return "F";
        }
        String[] names = fullName.split(" ");
        if (names.length >= 2) {
            return String.valueOf(names[0].charAt(0)) + names[names.length - 1].charAt(0);
        }
        return String.valueOf(fullName.charAt(0));
    }

    public boolean isActive() {
        return status == FacultyStatus.ACTIVE;
    }
}