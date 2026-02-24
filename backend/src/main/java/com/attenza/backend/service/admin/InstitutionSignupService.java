package com.attenza.backend.service.admin;

import com.attenza.backend.dto.admin.InstitutionSignupRequest;
import com.attenza.backend.entity.AdminStatus;
import com.attenza.backend.entity.AdminUser;
import com.attenza.backend.entity.Institution;
import com.attenza.backend.exception.BadRequestException;
import com.attenza.backend.repository.admin.AdminUserRepository;
import com.attenza.backend.repository.admin.InstitutionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.attenza.backend.util.IdGenerator;


@Service
@RequiredArgsConstructor
public class InstitutionSignupService {

    private final InstitutionRepository institutionRepo;
    private final AdminUserRepository adminRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public void registerInstitution(InstitutionSignupRequest request) {

        if (institutionRepo.existsByEmail(request.getInstitutionEmail())) {
            throw new BadRequestException("Institution already registered with this email");
        }

        if (adminRepo.existsByEmail(request.getAdminEmail())) {
            throw new BadRequestException("Admin email already exists");
        }

        Institution institution = new Institution();
        institution.setPublicId(IdGenerator.generateInstitutionPublicId());
        institution.setName(request.getInstitutionName());
        institution.setType(request.getInstitutionType());
        institution.setEmail(request.getInstitutionEmail());
        institution.setPhone(request.getInstitutionPhone());
        institution.setAddress(request.getAddress());
        institution.setCity(request.getCity());
        institution.setState(request.getState());
        institution.setCountry(request.getCountry());
        institution.setZipCode(request.getZipCode());

        institutionRepo.save(institution);

        AdminUser admin = new AdminUser();
        admin.setPublicId(IdGenerator.generateAdminPublicId());
        admin.setFullName(request.getAdminName());
        admin.setEmail(request.getAdminEmail());
        admin.setPhone(request.getAdminPhone());
        admin.setDesignation(request.getDesignation());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setInstitution(institution);
        admin.setStatus(AdminStatus.PENDING);

        adminRepo.save(admin);
    }
}
