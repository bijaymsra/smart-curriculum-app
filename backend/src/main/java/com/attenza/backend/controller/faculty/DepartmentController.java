package com.attenza.backend.controller.faculty;

import com.attenza.backend.entity.Department;
import com.attenza.backend.service.faculty.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/departments")
@RequiredArgsConstructor
public class DepartmentController {
    
    private final DepartmentService departmentService;
    
    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments(
            @RequestParam Long institutionId) {
        
        List<Department> departments = departmentService.getAllDepartments(institutionId);
        return ResponseEntity.ok(departments);
    }
    
    @PostMapping
    public ResponseEntity<Department> createDepartment(
            @RequestParam String code,
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam Long institutionId) {
        
        Department department = departmentService.createDepartment(code, name, description, institutionId);
        return ResponseEntity.ok(department);
    }
    
    @PutMapping("/{departmentId}")
    public ResponseEntity<Department> updateDepartment(
            @PathVariable Long departmentId,
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam Long institutionId) {
        
        Department department = departmentService.updateDepartment(departmentId, code, name, description, institutionId);
        return ResponseEntity.ok(department);
    }
    
    @DeleteMapping("/{departmentId}")
    public ResponseEntity<Void> deleteDepartment(
            @PathVariable Long departmentId,
            @RequestParam Long institutionId) {
        
        departmentService.deleteDepartment(departmentId, institutionId);
        return ResponseEntity.ok().build();
    }
}