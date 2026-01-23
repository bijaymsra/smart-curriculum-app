package com.attenza.backend.controller;

import com.attenza.backend.entity.Faculty;
import com.attenza.backend.repository.faculty.FacultyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {
    
    private final FacultyRepository facultyRepository;
    
    @GetMapping("/faculty/all")
    public ResponseEntity<?> getAllFaculty() {
        List<Faculty> allFaculty = facultyRepository.findAll();
        
        Map<String, Object> response = new HashMap<>();
        response.put("count", allFaculty.size());
        response.put("faculty", allFaculty.stream()
            .map(f -> Map.of(
                "id", f.getId(),
                "publicId", f.getPublicId(),
                "facultyId", f.getFacultyId(),
                "name", f.getFullName(),
                "email", f.getEmail(),
                "institutionId", f.getInstitution() != null ? f.getInstitution().getId() : "null"
            ))
            .collect(Collectors.toList()));
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/faculty/by-institution")
    public ResponseEntity<?> getFacultyByInstitution(@RequestParam Long institutionId) {
        List<Faculty> faculty = facultyRepository.findByInstitutionId(institutionId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("institutionId", institutionId);
        response.put("count", faculty.size());
        response.put("faculty", faculty.stream()
            .map(f -> Map.of(
                "id", f.getId(),
                "publicId", f.getPublicId(),
                "name", f.getFullName()
            ))
            .collect(Collectors.toList()));
        
        return ResponseEntity.ok(response);
    }
}