package com.attenza.backend.student.profile.service;

import com.attenza.backend.entity.Student;
import com.attenza.backend.exception.BadRequestException;
import com.attenza.backend.repository.admin.StudentRepository;
import com.attenza.backend.student.profile.dto.StudentProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentProfileService {

    private final StudentRepository studentRepository;

    public StudentProfileResponse getProfile(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new BadRequestException("Student not found"));

        return StudentProfileResponse.builder()
                .fullName(student.getFullName())
                .registrationNo(student.getRegistrationNo())
                .email(student.getEmail())
                .phone(student.getPhone())
                .gender(student.getGender())
                .dateOfBirth(student.getDateOfBirth())
                .course(student.getCourse())
                .department(student.getDepartment())
                .semester(student.getSemester())
                .section(student.getSection())
                .batch(student.getBatch())
                .rollNo(student.getRollNo())
                .admissionType(student.getAdmissionType())
                .institutionName(student.getInstitution().getName())
                .joinedDate(student.getJoinedDate())
                .status(student.getStatus().name())
                .build();
    }
}
