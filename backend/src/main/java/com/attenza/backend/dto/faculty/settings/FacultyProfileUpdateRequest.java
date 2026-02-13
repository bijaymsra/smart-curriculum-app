package com.attenza.backend.dto.faculty.settings;

import lombok.Data;

@Data
public class FacultyProfileUpdateRequest {

    private String phone;
    private String alternatePhone;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String emergencyContact;
}
