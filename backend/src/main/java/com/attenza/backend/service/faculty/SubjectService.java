package com.attenza.backend.service.faculty;

import com.attenza.backend.entity.Subject;
import com.attenza.backend.exception.BadRequestException;
import com.attenza.backend.repository.faculty.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectService {
    
    private final SubjectRepository subjectRepository;
    
    public List<Subject> getAllSubjects(Long institutionId) {
        return subjectRepository.findByDepartmentInstitutionId(institutionId);
    }
    
    public List<Subject> getSubjectsByDepartment(Long departmentId) {
        return subjectRepository.findByDepartmentId(departmentId);
    }
    
    public Subject createSubject(String subjectCode, String subjectName, String description,
                                 Integer credits, Integer semester, Long departmentId) {
        // Check if subject code already exists
        if (subjectRepository.findBySubjectCode(subjectCode).isPresent()) {
            throw new BadRequestException("Subject code already exists");
        }
        
        Subject subject = new Subject();
        subject.setSubjectCode(subjectCode);
        subject.setSubjectName(subjectName);
        subject.setDescription(description);
        subject.setCredits(credits);
        subject.setSemester(semester);
        
        // Set department
        com.attenza.backend.entity.Department department = new com.attenza.backend.entity.Department();
        department.setId(departmentId);
        subject.setDepartment(department);
        
        return subjectRepository.save(subject);
    }
}