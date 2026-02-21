package com.attenza.backend.controller.faculty;

import com.attenza.backend.dto.faculty.DocumentResponse;
import com.attenza.backend.entity.FacultyDocument;
import com.attenza.backend.service.faculty.FacultyDocumentService;
import com.attenza.backend.service.faculty.FacultyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/faculty-management")
@RequiredArgsConstructor
public class FacultyManagementController {
    
    private final FacultyService facultyService;
    private final FacultyDocumentService facultyDocumentService;
    
    @GetMapping("/filter/status/{status}")
    public ResponseEntity<?> getFacultyByStatus(
            @PathVariable String status,
            @RequestParam Long institutionId) {
        
        return ResponseEntity.ok(facultyService.getFacultyByStatus(institutionId, status));
    }
    
    @GetMapping("/filter/department/{departmentCode}")
    public ResponseEntity<?> getFacultyByDepartment(
            @PathVariable String departmentCode,
            @RequestParam Long institutionId) {
        
        return ResponseEntity.ok(facultyService.getFacultyByDepartment(institutionId, departmentCode));
    }
    
    @PutMapping("/{publicId}/performance")
    public ResponseEntity<Void> updatePerformance(
            @PathVariable String publicId,
            @RequestParam(required = false) Integer utilizationPercentage,
            @RequestParam(required = false) Integer punctualityPercentage,
            @RequestParam(required = false) Integer performanceScore,
            @RequestParam(required = false) Integer attendancePercentage,
            @RequestParam(required = false) Double rating,
            @RequestParam Long institutionId) {
        
        facultyService.updateFacultyPerformance(publicId, utilizationPercentage, punctualityPercentage,
                performanceScore, attendancePercentage, rating, institutionId);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{publicId}/workload")
    public ResponseEntity<Void> updateWorkload(
            @PathVariable String publicId,
            @RequestParam(required = false) Integer weeklyWorkloadHours,
            @RequestParam(required = false) Integer idleHours,
            @RequestParam Long institutionId) {
        
        facultyService.updateWorkload(publicId, weeklyWorkloadHours, idleHours, institutionId);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{publicId}/leaves")
    public ResponseEntity<Void> updateLeaves(
            @PathVariable String publicId,
            @RequestParam(required = false) Integer leavesTaken,
            @RequestParam(required = false) Integer leavesAvailable,
            @RequestParam(required = false) Integer medicalLeavesAvailable,
            @RequestParam(required = false) Integer casualLeavesAvailable,
            @RequestParam Long institutionId) {
        
        facultyService.updateLeaves(publicId, leavesTaken, leavesAvailable, 
                medicalLeavesAvailable, casualLeavesAvailable, institutionId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{publicId}/documents")
    public ResponseEntity<List<DocumentResponse>> getFacultyDocuments(
            @PathVariable String publicId) {
        
        List<DocumentResponse> documents = facultyDocumentService.getFacultyDocuments(publicId);
        return ResponseEntity.ok(documents);
    }
    
    @PostMapping("/{publicId}/documents/upload")
    public ResponseEntity<FacultyDocument> uploadDocument(
            @PathVariable String publicId,
            @RequestParam String documentName,
            @RequestParam String documentType,
            @RequestParam String category,
            @RequestParam String filePath,
            @RequestParam Long fileSize) {
        
        FacultyDocument document = facultyDocumentService.uploadDocument(
                publicId, documentName, documentType, category, filePath, fileSize);
        return ResponseEntity.ok(document);
    }
    
    @PostMapping("/documents/{documentId}/verify")
    public ResponseEntity<Void> verifyDocument(
            @PathVariable Long documentId,
            @RequestParam String adminPublicId) {
        
        facultyDocumentService.verifyDocument(documentId, adminPublicId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/documents/{documentId}")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable Long documentId) {
        
        facultyDocumentService.deleteDocument(documentId);
        return ResponseEntity.ok().build();
    }
}