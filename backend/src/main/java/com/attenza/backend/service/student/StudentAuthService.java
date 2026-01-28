package com.attenza.backend.service.student;

import com.attenza.backend.dto.student.StudentLoginRequest;
import com.attenza.backend.dto.student.StudentLoginResponse;
import com.attenza.backend.entity.Institution;
import com.attenza.backend.entity.Student;
import com.attenza.backend.entity.StudentStatus;
import com.attenza.backend.repository.admin.InstitutionRepository;
import com.attenza.backend.repository.admin.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.attenza.backend.security.JwtTokenService;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StudentAuthService {

    private final StudentRepository studentRepository;
    private final InstitutionRepository institutionRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenService jwtService;

    public StudentLoginResponse login(StudentLoginRequest request) {
        
        // 1. FIND INSTITUTION
        Institution institution = findInstitution(request.institutionId());
        
        // 2. FIND STUDENT BY registrationNo AND institutionId
        Student student = studentRepository
                .findByRegistrationNoAndInstitution_Id(
                    request.registrationNo(), 
                    institution.getId()
                )
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // 3. STATUS CHECK
        if (student.getStatus() != StudentStatus.ACTIVE &&
            student.getStatus() != StudentStatus.WARNING) {
            throw new RuntimeException(
                    "Account is not active. Please contact administration."
            );
        }

        // 4. PASSWORD CHECK
        if (student.getPasswordHash() == null ||
            !passwordEncoder.matches(
                    request.password(),
                    student.getPasswordHash()
            )) {
            throw new RuntimeException("Invalid credentials");
        }

        // 5. UPDATE LAST ACTIVE
        student.setLastActive(LocalDateTime.now());
        studentRepository.save(student);

        // NEW STEP: Generate Token
        String token = jwtService.generateToken(student);

        // 6. RETURN RESPONSE
        return new StudentLoginResponse(
                token,
                student.getId(),
                student.getFullName(),
                student.getRegistrationNo(),
                student.getStatus().name(),
                institution.getName(),
                institution.getPublicId()
        );

    }

    private Institution findInstitution(String identifier) {
        // Try to parse as Long (institution ID)
        try {
            Long id = Long.parseLong(identifier);
            return institutionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Invalid institution"));
        } catch (NumberFormatException e) {
            // If not a number, try publicId
            return institutionRepository.findByPublicId(identifier)
                    .orElseThrow(() -> new RuntimeException("Invalid institution"));
        }
    }

    public void logout(Long studentId) {
        studentRepository.findById(studentId).ifPresent(student -> {
            student.setLastActive(LocalDateTime.now());
            studentRepository.save(student);
        });
    }
}