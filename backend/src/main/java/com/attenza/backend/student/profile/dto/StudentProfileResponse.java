package com.attenza.backend.student.profile.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class StudentProfileResponse {

    private String fullName;
    private String registrationNo;
    private String email;
    private String phone;
    private String gender;
    private LocalDate dateOfBirth;

    private String course;
    private String department;
    private Integer semester;
    private String section;
    private String batch;
    private String rollNo;
    private String admissionType;

    private String institutionName;
    private LocalDate joinedDate;
    private String status;
}
