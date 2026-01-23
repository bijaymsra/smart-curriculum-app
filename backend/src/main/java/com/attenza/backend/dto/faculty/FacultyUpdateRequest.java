package com.attenza.backend.dto.faculty;

import com.attenza.backend.entity.enums.EmploymentType;
import com.attenza.backend.entity.enums.FacultyStatus;  // Add this import
import com.attenza.backend.entity.enums.Gender;
import jakarta.validation.constraints.Email;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FacultyUpdateRequest {

    // Basic Profile
    private String fullName;

    @Email(message = "Invalid email format")
    private String email;

    private String phone;
    private Gender gender;
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

    // Status field - ADD THIS
    private FacultyStatus status;  

    // Academic Details
    private String departmentCode;
    private String designation;
    private String qualification;
    private String specialization;
    private Integer experienceYears;
    private String researchArea;
    private Integer yearOfPassing;
    private String institutionName;

    // Employment
    private LocalDate joinDate;
    private EmploymentType employmentType;
    private String salaryGrade;

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
}