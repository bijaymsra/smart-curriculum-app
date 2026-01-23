package com.attenza.backend.controller.faculty;

import com.attenza.backend.dto.faculty.*;
import com.attenza.backend.service.faculty.FacultyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.attenza.backend.dto.faculty.FacultyResponse;
import com.attenza.backend.entity.enums.FacultyStatus;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/faculty")
@RequiredArgsConstructor
public class FacultyController {
    
    private final FacultyService facultyService;
    
    @GetMapping
    public ResponseEntity<Page<FacultyResponse>> getAllFaculty(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam Long institutionId) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<FacultyResponse> facultyPage = facultyService.getAllFaculty(institutionId, pageable);
        return ResponseEntity.ok(facultyPage);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<FacultyResponse>> searchFaculty(
            @RequestParam String query,
            @RequestParam Long institutionId) {
        
        List<FacultyResponse> facultyList = facultyService.searchFaculty(institutionId, query);
        return ResponseEntity.ok(facultyList);
    }
    
    @GetMapping("/{publicId}")
    public ResponseEntity<FacultyDetailResponse> getFaculty(
            @PathVariable String publicId,
            @RequestParam Long institutionId) {
        
        FacultyDetailResponse faculty = facultyService.getFacultyByPublicId(publicId, institutionId);
        return ResponseEntity.ok(faculty);
    }
    
    @PostMapping
    public ResponseEntity<FacultyDetailResponse> createFaculty(
            @Valid @RequestBody FacultyCreateRequest request,
            @RequestParam Long institutionId) {
        
        FacultyDetailResponse createdFaculty = facultyService.createFaculty(request, institutionId);
        return ResponseEntity.ok(createdFaculty);
    }
    
    @PutMapping("/{publicId}")
    public ResponseEntity<FacultyDetailResponse> updateFaculty(
            @PathVariable String publicId,
            @Valid @RequestBody FacultyUpdateRequest request,
            @RequestParam Long institutionId) {
        
        FacultyDetailResponse updatedFaculty = facultyService.updateFaculty(publicId, request, institutionId);
        return ResponseEntity.ok(updatedFaculty);
    }
    
    @DeleteMapping("/{publicId}")
    public ResponseEntity<Void> deleteFaculty(
            @PathVariable String publicId,
            @RequestParam Long institutionId) {
        
        facultyService.deleteFaculty(publicId, institutionId);
        return ResponseEntity.ok().build();
    }


    @PatchMapping("/{publicId}/status")
    public ResponseEntity<Void> updateFacultyStatus(
            @PathVariable String publicId,
            @RequestParam FacultyStatus status,
            @RequestParam Long institutionId) {

        facultyService.updateFacultyStatus(publicId, status, institutionId);
        return ResponseEntity.ok().build();
    }

    
    @GetMapping("/stats")
    public ResponseEntity<FacultyStatsResponse> getFacultyStats(
            @RequestParam Long institutionId) {
        
        FacultyStatsResponse stats = facultyService.getFacultyStats(institutionId);
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/{publicId}/permissions")
    public ResponseEntity<Map<String, Boolean>> getPermissions(
            @PathVariable String publicId,
            @RequestParam Long institutionId) {
        
        Map<String, Boolean> permissions = facultyService.getPermissions(publicId, institutionId);
        return ResponseEntity.ok(permissions);
    }
    
    @PutMapping("/{publicId}/permissions")
    public ResponseEntity<Map<String, Boolean>> updatePermissions(
            @PathVariable String publicId,
            @Valid @RequestBody FacultyPermissionsRequest request,
            @RequestParam Long institutionId) {
        
        Map<String, Boolean> updatedPermissions = facultyService.updatePermissions(publicId, request, institutionId);
        return ResponseEntity.ok(updatedPermissions);
    }



@GetMapping("/filter")
public ResponseEntity<?> filterFaculty(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String department,
        @RequestParam(required = false) String utilization,
        @RequestParam(required = false) String search,
        @RequestParam Long institutionId) {
    
    List<FacultyResponse> filteredFaculty = facultyService.filterFaculty(
        institutionId, 
        status, 
        department, 
        utilization, 
        search
    );
    
    return ResponseEntity.ok(filteredFaculty);
}

    @GetMapping("/export")
    public ResponseEntity<?> exportFaculty(
            @RequestParam(required = false) String format,
            @RequestParam Long institutionId) {
        
        // Export logic (CSV, Excel, PDF)
        // You can implement this based on your needs
        
        List<FacultyResponse> facultyList = facultyService.getAllFaculty(institutionId, Pageable.unpaged())
                .getContent();
        
        return ResponseEntity.ok()
                .header("Content-Type", "text/csv")
                .header("Content-Disposition", "attachment; filename=\"faculty_export.csv\"")
                .body(exportToCsv(facultyList));
    }

    private String exportToCsv(List<FacultyResponse> facultyList) {
        // Simple CSV export implementation
        StringBuilder csv = new StringBuilder();
        csv.append("Faculty ID,Name,Email,Department,Designation,Status,Utilization%,Rating\n");
        
        for (FacultyResponse faculty : facultyList) {
            csv.append(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%d,%.1f\n",
                    faculty.getFacultyId(),
                    faculty.getFullName(),
                    faculty.getEmail(),
                    faculty.getDepartmentName(),
                    faculty.getDesignation(),
                    faculty.getStatus(),
                    faculty.getUtilizationPercentage(),
                    faculty.getRating()));
        }
        
        return csv.toString();
    }


}