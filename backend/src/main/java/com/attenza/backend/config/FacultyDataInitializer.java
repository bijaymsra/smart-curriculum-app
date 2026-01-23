package com.attenza.backend.config;

import com.attenza.backend.entity.Department;
import com.attenza.backend.entity.Institution;
import com.attenza.backend.repository.faculty.DepartmentRepository;
import com.attenza.backend.repository.admin.InstitutionRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FacultyDataInitializer {
    
    private final DepartmentRepository departmentRepository;
    private final InstitutionRepository institutionRepository;
    
    @PostConstruct
    public void init() {
        // Create default departments if they don't exist
        createDefaultDepartments();
    }
    
    private void createDefaultDepartments() {
        // Get or create a default institution
        Institution institution = institutionRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> {
                    Institution inst = new Institution();
                    inst.setName("Default University");
                    inst.setEmail("admin@university.edu");
                    inst.setType("UNIVERSITY");
                    return institutionRepository.save(inst);
                });
        
        // Create default departments
        String[][] departments = {
            {"CSE", "Computer Science and Engineering"},
            {"ECE", "Electronics and Communication Engineering"},
            {"ME", "Mechanical Engineering"},
            {"CE", "Civil Engineering"},
            {"EEE", "Electrical and Electronics Engineering"},
            {"IT", "Information Technology"},
            {"MATHS", "Mathematics"},
            {"PHYSICS", "Physics"},
            {"CHEMISTRY", "Chemistry"},
            {"MANAGEMENT", "Management Studies"}
        };
        
        for (String[] dept : departments) {
            if (!departmentRepository.existsByDepartmentCodeAndInstitutionId(dept[0], institution.getId())) {
                Department department = new Department();
                department.setDepartmentCode(dept[0]);
                department.setDepartmentName(dept[1]);
                department.setInstitution(institution);
                departmentRepository.save(department);
            }
        }
    }
}