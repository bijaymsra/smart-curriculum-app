package com.attenza.backend.dto.admin;

import com.attenza.backend.entity.AdminUser;
import com.attenza.backend.entity.Institution;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminProfileResponse {

    // 🔐 Admin
    private String publicId;
    private String fullName;
    private String email;
    private String phone;
    private String designation;
    private String status;
    private String role;
    private LocalDateTime createdAt;

    // 🏫 Institution (flattened)
    private String institutionPublicId;
    private String institutionName;
    private String institutionType;
    private String institutionEmail;
    private String institutionPhone;
    private String institutionAddress;
    private String institutionCity;
    private String institutionState;
    private String institutionZipCode;
    private String institutionCountry;
    private LocalDateTime institutionCreatedAt;

    public static AdminProfileResponse from(AdminUser admin) {
        AdminProfileResponse res = new AdminProfileResponse();

        res.setPublicId(admin.getPublicId());
        res.setFullName(admin.getFullName());
        res.setEmail(admin.getEmail());
        res.setPhone(admin.getPhone());
        res.setDesignation(admin.getDesignation());
        res.setStatus(admin.getStatus().name());
        res.setRole(admin.getRole().name());
        res.setCreatedAt(admin.getCreatedAt());

        Institution inst = admin.getInstitution();
        if (inst != null) {
            res.setInstitutionPublicId(inst.getPublicId());
            res.setInstitutionName(inst.getName());
            res.setInstitutionType(inst.getType());
            res.setInstitutionEmail(inst.getEmail());
            res.setInstitutionPhone(inst.getPhone());
            res.setInstitutionAddress(inst.getAddress());
            res.setInstitutionCity(inst.getCity());
            res.setInstitutionState(inst.getState());
            res.setInstitutionZipCode(inst.getZipCode());
            res.setInstitutionCountry(inst.getCountry());
            res.setInstitutionCreatedAt(inst.getCreatedAt());
        }

        return res;
    }
}
