package com.attenza.backend.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InstitutionSignupRequest {

    // Institution
    private String institutionName;
    private String institutionType;
    private String institutionEmail;
    private String institutionPhone;
    private String address;
    private String city;
    private String state;
    private String country;
    private String zipCode;

    // Admin
    private String adminName;
    private String adminEmail;
    private String adminPhone;
    private String designation;
    private String password;
}
