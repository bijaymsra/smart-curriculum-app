package com.attenza.backend.service.faculty;

import com.attenza.backend.entity.Department;
import com.attenza.backend.entity.Institution;
import com.attenza.backend.exception.BadRequestException;
import com.attenza.backend.repository.faculty.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    
    private final DepartmentRepository departmentRepository;
    
    public List<Department> getAllDepartments(Long institutionId) {
        return departmentRepository.findByInstitutionId(institutionId);
    }
    
    public Department createDepartment(String code, String name, String description, Long institutionId) {
        if (departmentRepository.existsByDepartmentCodeAndInstitutionId(code, institutionId)) {
            throw new BadRequestException("Department code already exists in this institution");
        }
        
        Department department = new Department();
        department.setDepartmentCode(code);
        department.setDepartmentName(name);
        department.setDescription(description);
        
        Institution institution = new Institution();
        institution.setId(institutionId);
        department.setInstitution(institution);
        
        return departmentRepository.save(department);
    }
    
    public Department updateDepartment(Long departmentId, String code, String name, 
                                       String description, Long institutionId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new BadRequestException("Department not found"));
        
        if (!department.getInstitution().getId().equals(institutionId)) {
            throw new BadRequestException("Department not found in your institution");
        }
        
        if (code != null && !code.equals(department.getDepartmentCode())) {
            if (departmentRepository.existsByDepartmentCodeAndInstitutionId(code, institutionId)) {
                throw new BadRequestException("Department code already exists in this institution");
            }
            department.setDepartmentCode(code);
        }
        
        if (name != null) department.setDepartmentName(name);
        if (description != null) department.setDescription(description);
        
        return departmentRepository.save(department);
    }
    
    public void deleteDepartment(Long departmentId, Long institutionId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new BadRequestException("Department not found"));
        
        if (!department.getInstitution().getId().equals(institutionId)) {
            throw new BadRequestException("Department not found in your institution");
        }
        
        
        departmentRepository.delete(department);
    }
}