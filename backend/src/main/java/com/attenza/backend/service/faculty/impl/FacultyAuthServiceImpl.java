package com.attenza.backend.service.faculty.impl;

import com.attenza.backend.dto.faculty.FacultyLoginRequest;
import com.attenza.backend.dto.faculty.FacultyLoginResponse;
import com.attenza.backend.entity.Faculty;
import com.attenza.backend.exception.BadRequestException;
import com.attenza.backend.repository.faculty.FacultyRepository;
import com.attenza.backend.security.JwtTokenService;
import com.attenza.backend.service.faculty.FacultyAuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FacultyAuthServiceImpl implements FacultyAuthService {

    private final FacultyRepository facultyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;   

    @Override
    public FacultyLoginResponse login(FacultyLoginRequest request) {

        Faculty faculty = facultyRepository
                .findByFacultyIdAndInstitution_PublicId(
                        request.getFacultyId(),
                        request.getInstitutionId()
                )
                .orElseThrow(() ->
                        new BadRequestException("Invalid Faculty ID or Institution ID"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                faculty.getPasswordHash()
        )) {
            throw new BadRequestException("Invalid password");
        }

        if (!faculty.isActive()) {
            throw new BadRequestException("Faculty account is inactive");
        }

        String token = jwtTokenService.generateToken(
                faculty.getFacultyId(),   
                "FACULTY"                 
        );

        return FacultyLoginResponse.builder()
                .facultyId(faculty.getFacultyId())
                .fullName(faculty.getFullName())
                .email(faculty.getEmail())
                .department(faculty.getDepartment().getDepartmentName())
                .institutionId(faculty.getInstitution().getPublicId())
                .institutionName(faculty.getInstitution().getName())
                .token(token)   
                .build();
    }

    @Override
    public void logout(Long facultyId) {
    }
}
