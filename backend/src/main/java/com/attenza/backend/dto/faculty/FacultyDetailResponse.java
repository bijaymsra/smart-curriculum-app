package com.attenza.backend.dto.faculty;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class FacultyDetailResponse {
    // Core Identity
    private String publicId;
    private String facultyId;
    private String email;
    
    // Basic Profile
    private String fullName;
    private String phone;
    private String gender;
    private LocalDate dateOfBirth;
    private String bloodGroup;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String emergencyContact;
    private String alternatePhone;
    private String maritalStatus;
    private String nationality;
    
    // Academic Details
    private String departmentName;
    private String designation;
    private String qualification;
    private String specialization;
    private Integer experienceYears;
    private String researchArea;
    private Integer yearOfPassing;
    private String institutionName;
    
    // Employment
    private LocalDate joinDate;
    private String employmentType;
    private String salaryGrade;
    
    // Status
    private String status;
    private Boolean accountLocked;
    
    // Performance Metrics
    private Integer utilizationPercentage;
    private Integer punctualityPercentage;
    private Integer performanceScore;
    private Integer attendancePercentage;
    private Double rating;
    
    // Workload
    private Integer weeklyWorkloadHours;
    private Integer idleHours;
    private Integer maxWorkloadHours;
    
    // Leave Management
    private Integer leavesTaken;
    private Integer leavesAvailable;
    private Integer medicalLeavesAvailable;
    private Integer casualLeavesAvailable;
    
    // Financial
    private String accountNumber;
    private String bankName;
    private String ifscCode;
    private String panNumber;
    private String uanNumber;
    
    // Research
    private Integer researchPapersCount;
    private Integer conferencesAttended;
    private Integer projectsCompleted;
    private Integer publicationsCount;
    
    // Related Data
    private List<String> subjects;
    private Map<String, Boolean> permissions;
    private List<DocumentResponse> documents;
    
    // Activity
    private LocalDateTime lastActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}