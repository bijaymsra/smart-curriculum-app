package com.attenza.backend.dto.faculty;

import com.attenza.backend.entity.enums.EmploymentType;
import com.attenza.backend.entity.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FacultyCreateRequest {

    // =====================
    // Core Identity
    // =====================
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phone;
    private String alternatePhone;

    private Gender gender;
    private LocalDate dateOfBirth;
    private String bloodGroup;
    private String maritalStatus;
    private String nationality;

    // =====================
    // Employment Details
    // =====================
    @NotBlank(message = "Department is required")
    private String departmentCode;

    @NotBlank(message = "Designation is required")
    private String designation;

    @NotNull(message = "Join date is required")
    private LocalDate joinDate;

    private EmploymentType employmentType = EmploymentType.PERMANENT;

    private Integer experienceYears;

    // =====================
    // Academic Profile
    // =====================
    private String qualification;
    private String specialization;
    private String researchArea;
    private Integer yearOfPassing;
    private String institutionName;

    // =====================
    // Contact & Address
    // =====================
    private String address;
    private String city;
    private String state;
    private String pincode;

    private String emergencyContact;
}
