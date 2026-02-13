package com.attenza.backend.dto.faculty.settings;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FacultySettingsResponse {

    /* =========================
       PROFILE (Editable + Readonly)
       ========================= */

    private String facultyId;          // Read-only
    private String fullName;           // Read-only
    private String designation;        // Read-only
    private String departmentName;     // Read-only
    private String institutionName;    // Read-only
    private String employmentType;     // Read-only
    private String joinDate;           // Read-only

    /* =========================
       Editable Contact Fields
       ========================= */

    private String phone;
    private String alternatePhone;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String emergencyContact;

    /* =========================
       Leave Overview
       ========================= */

    private int leavesAvailable;
    private int leavesTaken;
    private int casualLeavesAvailable;
    private int medicalLeavesAvailable;

    /* =========================
       Workload Overview
       ========================= */

    private int weeklyWorkloadHours;
    private int maxWorkloadHours;
    private int utilizationPercentage;

    /* =========================
       Account Info
       ========================= */

    private String status;
    private String lastActive;
}
