package com.attenza.backend.service.faculty;

import com.attenza.backend.dto.faculty.*;
import com.attenza.backend.entity.*;
import com.attenza.backend.entity.enums.FacultyStatus;
import com.attenza.backend.exception.BadRequestException;
import com.attenza.backend.repository.faculty.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.attenza.backend.dto.faculty.FacultyResponse;
import com.attenza.backend.service.faculty.FacultyEmailService;
import com.attenza.backend.util.IdGenerator;
import lombok.extern.slf4j.Slf4j;
import com.attenza.backend.repository.faculty.FacultyDocumentRepository;
import java.util.Optional;
import com.attenza.backend.dto.faculty.DocumentResponse;
import com.attenza.backend.entity.FacultyPermissions;


import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacultyService {
    
    private final FacultyRepository facultyRepository;
    private final FacultyPermissionsRepository permissionsRepository;
    private final FacultyDocumentRepository facultyDocumentRepository;
    private final DepartmentRepository departmentRepository;
    private final SubjectRepository subjectRepository;
    private final PasswordEncoder passwordEncoder;
    private final FacultyEmailService facultyEmailService;

    
    // ========== CRUD Operations ==========

    @Transactional
    public FacultyDetailResponse createFaculty(FacultyCreateRequest request, Long institutionId) {

        // Check if email already exists in this institution
        if (facultyRepository.existsByEmailAndInstitutionId(request.getEmail(), institutionId)) {
            throw new BadRequestException("Email already exists in this institution");
        }

        Department department = departmentRepository
                .findByInstitutionIdAndDepartmentCode(institutionId, request.getDepartmentCode())
                .orElseThrow(() -> new BadRequestException("Department not found"));

        Faculty faculty = new Faculty();

        // 🔹 AUTO-GENERATED VALUES
        faculty.setFacultyId(IdGenerator.generateFacultyId());

        String rawPassword = IdGenerator.generateRandomPassword();
        faculty.setPasswordHash(passwordEncoder.encode(rawPassword));

        faculty.setStatus(FacultyStatus.INACTIVE);
        faculty.setAccountLocked(true);
        faculty.setCredentialsSent(false);

        // 🔹 BASIC DATA
        faculty.setFullName(request.getFullName());
        faculty.setEmail(request.getEmail());
        faculty.setPhone(request.getPhone());
        faculty.setAlternatePhone(request.getAlternatePhone());

        faculty.setGender(request.getGender());
        faculty.setDateOfBirth(request.getDateOfBirth());
        faculty.setBloodGroup(request.getBloodGroup());
        faculty.setMaritalStatus(request.getMaritalStatus());
        faculty.setNationality(request.getNationality());

        faculty.setDepartment(department);
        faculty.setDesignation(request.getDesignation());
        faculty.setQualification(request.getQualification());
        faculty.setSpecialization(request.getSpecialization());
        faculty.setResearchArea(request.getResearchArea());
        faculty.setExperienceYears(request.getExperienceYears());
        faculty.setYearOfPassing(request.getYearOfPassing());
        faculty.setInstitutionName(request.getInstitutionName());

        faculty.setAddress(request.getAddress());
        faculty.setCity(request.getCity());
        faculty.setState(request.getState());
        faculty.setPincode(request.getPincode());
        faculty.setEmergencyContact(request.getEmergencyContact());

        faculty.setJoinDate(request.getJoinDate());
        faculty.setEmploymentType(request.getEmploymentType());


        Institution institution = new Institution();
        institution.setId(institutionId);
        faculty.setInstitution(institution);

        Faculty savedFaculty = facultyRepository.save(faculty);

        createDefaultPermissions(savedFaculty);


        return convertToDetailResponse(savedFaculty);
    }


    
    public FacultyDetailResponse getFacultyByPublicId(String publicId, Long institutionId) {
        Faculty faculty = facultyRepository.findByPublicId(publicId)
                .orElseThrow(() -> new BadRequestException("Faculty not found"));
        
        // Check if faculty belongs to the institution
        if (!faculty.getInstitution().getId().equals(institutionId)) {
            throw new BadRequestException("Faculty not found in your institution");
        }
        
        return convertToDetailResponse(faculty);
    }
    
    public Page<FacultyResponse> getAllFaculty(Long institutionId, Pageable pageable) {
        Page<Faculty> facultyPage = facultyRepository.findByInstitutionId(institutionId, pageable);
        return facultyPage.map(this::convertToResponse);
    }
    
    public List<FacultyResponse> searchFaculty(Long institutionId, String searchTerm) {
        List<Faculty> facultyList = facultyRepository.searchByInstitutionAndKeyword(institutionId, searchTerm);
        return facultyList.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
@Transactional
public FacultyDetailResponse updateFaculty(String publicId, FacultyUpdateRequest request, Long institutionId) {
    Faculty faculty = facultyRepository.findByPublicId(publicId)
            .orElseThrow(() -> new BadRequestException("Faculty not found"));
    
    // Check if faculty belongs to the institution
    if (!faculty.getInstitution().getId().equals(institutionId)) {
        throw new BadRequestException("Faculty not found in your institution");
    }
    
    // Update basic info
    if (request.getFullName() != null) faculty.setFullName(request.getFullName());
    if (request.getEmail() != null) {
        // Check if new email is unique in institution
        if (!request.getEmail().equals(faculty.getEmail()) &&
            facultyRepository.existsByEmailAndInstitutionId(request.getEmail(), institutionId)) {
            throw new BadRequestException("Email already exists in this institution");
        }
        faculty.setEmail(request.getEmail());
    }
    if (request.getPhone() != null) faculty.setPhone(request.getPhone());
    if (request.getAlternatePhone() != null) faculty.setAlternatePhone(request.getAlternatePhone()); 
    if (request.getGender() != null) faculty.setGender(request.getGender());
    if (request.getDateOfBirth() != null) faculty.setDateOfBirth(request.getDateOfBirth());
    if (request.getBloodGroup() != null) faculty.setBloodGroup(request.getBloodGroup());
    if (request.getMaritalStatus() != null) faculty.setMaritalStatus(request.getMaritalStatus()); 
    if (request.getNationality() != null) faculty.setNationality(request.getNationality()); 
    if (request.getAddress() != null) faculty.setAddress(request.getAddress());
    if (request.getCity() != null) faculty.setCity(request.getCity());
    if (request.getState() != null) faculty.setState(request.getState());
    if (request.getPincode() != null) faculty.setPincode(request.getPincode());
    if (request.getEmergencyContact() != null) faculty.setEmergencyContact(request.getEmergencyContact());
    
    // Update academic details
    if (request.getDepartmentCode() != null) {
        Department department = departmentRepository
                .findByInstitutionIdAndDepartmentCode(institutionId, request.getDepartmentCode())
                .orElseThrow(() -> new BadRequestException("Department not found"));
        faculty.setDepartment(department);
    }
    if (request.getDesignation() != null) faculty.setDesignation(request.getDesignation());
    if (request.getQualification() != null) faculty.setQualification(request.getQualification());
    if (request.getSpecialization() != null) faculty.setSpecialization(request.getSpecialization());
    if (request.getExperienceYears() != null) faculty.setExperienceYears(request.getExperienceYears());
    if (request.getResearchArea() != null) faculty.setResearchArea(request.getResearchArea());
    if (request.getYearOfPassing() != null) faculty.setYearOfPassing(request.getYearOfPassing()); // ADD THIS
    if (request.getInstitutionName() != null) faculty.setInstitutionName(request.getInstitutionName()); // ADD THIS
    
    // Update employment
    if (request.getJoinDate() != null) faculty.setJoinDate(request.getJoinDate());
    if (request.getEmploymentType() != null) faculty.setEmploymentType(request.getEmploymentType());
    if (request.getSalaryGrade() != null) faculty.setSalaryGrade(request.getSalaryGrade());
    // if (request.getStatus() != null) faculty.setStatus(request.getStatus());
    
    // Update financial
    if (request.getAccountNumber() != null) faculty.setAccountNumber(request.getAccountNumber());
    if (request.getBankName() != null) faculty.setBankName(request.getBankName());
    if (request.getIfscCode() != null) faculty.setIfscCode(request.getIfscCode());
    if (request.getPanNumber() != null) faculty.setPanNumber(request.getPanNumber());
    if (request.getUanNumber() != null) faculty.setUanNumber(request.getUanNumber());
    
    // Update research
    if (request.getResearchPapersCount() != null) faculty.setResearchPapersCount(request.getResearchPapersCount());
    if (request.getConferencesAttended() != null) faculty.setConferencesAttended(request.getConferencesAttended());
    if (request.getProjectsCompleted() != null) faculty.setProjectsCompleted(request.getProjectsCompleted());
    if (request.getPublicationsCount() != null) faculty.setPublicationsCount(request.getPublicationsCount());
    
    faculty.setLastActive(LocalDateTime.now());
    Faculty updatedFaculty = facultyRepository.save(faculty);
    
    return convertToDetailResponse(updatedFaculty);
}


    @Transactional
    public void updateFacultyStatus(String publicId,
                                    FacultyStatus newStatus,
                                    Long institutionId) {

        Faculty faculty = facultyRepository.findByPublicId(publicId)
                .orElseThrow(() -> new BadRequestException("Faculty not found"));

        // Institution ownership check
        if (!faculty.getInstitution().getId().equals(institutionId)) {
            throw new BadRequestException("Faculty not found in your institution");
        }

        FacultyStatus oldStatus = faculty.getStatus();

        // No-op protection
        if (oldStatus == newStatus) {
            throw new BadRequestException("Faculty already in status: " + newStatus);
        }

        // =========================
        // 🔥 FIRST-TIME ACTIVATION
        // =========================
        if (newStatus == FacultyStatus.ACTIVE && !faculty.getCredentialsSent()) {

            // Generate temporary password (DO NOT STORE IT)
            String tempPassword = IdGenerator.generateTempPassword();

            // Store only HASH
            faculty.setPasswordHash(passwordEncoder.encode(tempPassword));

            // Unlock account
            faculty.setAccountLocked(false);
            faculty.setFailedLoginAttempts(0);

            // Update status & flags
            faculty.setStatus(FacultyStatus.ACTIVE);
            faculty.setCredentialsSent(true);

            // Persist first
            facultyRepository.save(faculty);

            // Send activation email AFTER save
            facultyEmailService.sendFacultyActivationEmail(
                    faculty,
                    tempPassword
            );

            return; // IMPORTANT: stop here
        }

        // =========================
        // 🔁 ALL OTHER STATUS CHANGES
        // =========================
        faculty.setStatus(newStatus);

        facultyRepository.save(faculty);

        facultyEmailService.sendFacultyStatusChangeEmail(
                faculty,
                oldStatus,
                newStatus
        );
    }


    

    @Transactional
    public void deleteFaculty(String publicId, Long institutionId) {
        // Find faculty
        Faculty faculty = facultyRepository.findByPublicId(publicId)
                .orElseThrow(() -> new BadRequestException("Faculty not found with ID: " + publicId));
        
        // Check institution
        if (!faculty.getInstitution().getId().equals(institutionId)) {
            throw new BadRequestException("Faculty belongs to different institution");
        }
        
        Long facultyId = faculty.getId();
        
        // 1. Clear subjects (faculty_subjects table)
        if (faculty.getSubjects() != null && !faculty.getSubjects().isEmpty()) {
            faculty.getSubjects().clear();
            facultyRepository.save(faculty); // Updates join table
        }
        
        // 2. Delete permissions (faculty_permissions table)
        permissionsRepository.findByFacultyId(facultyId)
            .ifPresent(permissionsRepository::delete);
        
        // 3. Delete documents (faculty_documents table) 
        List<FacultyDocument> documents = facultyDocumentRepository.findByFacultyId(facultyId);
        if (!documents.isEmpty()) {
            facultyDocumentRepository.deleteAll(documents);
        }
        
        // 4. Delete faculty
        facultyRepository.delete(faculty);
    }

    
    // ========== Permissions Management ==========
    
    @Transactional
    public Map<String, Boolean> updatePermissions(String facultyPublicId, 
                                                  FacultyPermissionsRequest request, 
                                                  Long institutionId) {
        Faculty faculty = facultyRepository.findByPublicId(facultyPublicId)
                .orElseThrow(() -> new BadRequestException("Faculty not found"));
        
        // Check if faculty belongs to the institution
        if (!faculty.getInstitution().getId().equals(institutionId)) {
            throw new BadRequestException("Faculty not found in your institution");
        }
        
        FacultyPermissions permissions = permissionsRepository.findByFacultyId(faculty.getId())
                .orElseGet(() -> createDefaultPermissions(faculty));
        
        if (request.getAttendanceAccess() != null) permissions.setAttendanceAccess(request.getAttendanceAccess());
        if (request.getStudentManagement() != null) permissions.setStudentManagement(request.getStudentManagement());
        if (request.getMarksEntry() != null) permissions.setMarksEntry(request.getMarksEntry());
        if (request.getCourseCreation() != null) permissions.setCourseCreation(request.getCourseCreation());
        if (request.getExamManagement() != null) permissions.setExamManagement(request.getExamManagement());
        if (request.getLeaveApproval() != null) permissions.setLeaveApproval(request.getLeaveApproval());
        if (request.getNoticeBoardAccess() != null) permissions.setNoticeBoardAccess(request.getNoticeBoardAccess());
        if (request.getAnalyticsAccess() != null) permissions.setAnalyticsAccess(request.getAnalyticsAccess());
        if (request.getAdminAccess() != null) permissions.setAdminAccess(request.getAdminAccess());
        
        permissionsRepository.save(permissions);
        
        return convertPermissionsToMap(permissions);
    }
    
    public Map<String, Boolean> getPermissions(String facultyPublicId, Long institutionId) {
        Faculty faculty = facultyRepository.findByPublicId(facultyPublicId)
                .orElseThrow(() -> new BadRequestException("Faculty not found"));
        
        // Check if faculty belongs to the institution
        if (!faculty.getInstitution().getId().equals(institutionId)) {
            throw new BadRequestException("Faculty not found in your institution");
        }
        
        FacultyPermissions permissions = permissionsRepository.findByFacultyId(faculty.getId())
                .orElseGet(() -> createDefaultPermissions(faculty));
        
        return convertPermissionsToMap(permissions);
    }
    
    // ========== Stats & Dashboard ==========
    
        
    public FacultyStatsResponse getFacultyStats(Long institutionId) {
        FacultyStatsResponse stats = new FacultyStatsResponse();
        
        // Total faculty
        Long totalFaculty = facultyRepository.countByInstitutionId(institutionId);
        stats.setTotalFaculty(totalFaculty != null ? totalFaculty : 0L);
        
        // Active faculty
        Long activeFaculty = facultyRepository.countActiveByInstitutionId(institutionId);
        stats.setActiveFaculty(activeFaculty != null ? activeFaculty : 0L);
        
        // Average utilization
        Double avgUtilization = facultyRepository.findAverageUtilizationByInstitutionId(institutionId);
        stats.setAvgUtilization(avgUtilization != null ? avgUtilization : 0.0);
        
        // Average punctuality
        Double avgPunctuality = facultyRepository.findAveragePunctualityByInstitutionId(institutionId);
        stats.setAvgPunctuality(avgPunctuality != null ? avgPunctuality : 0.0);
        
        // Warning faculty (using efficient count method)
        Long warningCount = facultyRepository.countByInstitutionIdAndStatus(institutionId, FacultyStatus.WARNING);
        stats.setWarningFaculty(warningCount != null ? warningCount : 0L);
        
        // On leave faculty (using efficient count method)
        Long onLeaveCount = facultyRepository.countByInstitutionIdAndStatus(institutionId, FacultyStatus.ON_LEAVE);
        stats.setOnLeaveFaculty(onLeaveCount != null ? onLeaveCount : 0L);
        
        return stats;
    }


    
    // ========== Helper Methods ==========
    
    private FacultyPermissions createDefaultPermissions(Faculty faculty) {
        FacultyPermissions permissions = new FacultyPermissions();
        permissions.setFaculty(faculty);
        permissions.setAttendanceAccess(true);
        permissions.setNoticeBoardAccess(true);
        return permissionsRepository.save(permissions);
    }
    
    
    private FacultyResponse convertToResponse(Faculty faculty) {
        FacultyResponse response = new FacultyResponse();
        response.setPublicId(faculty.getPublicId());
        response.setFacultyId(faculty.getFacultyId());
        response.setFullName(faculty.getFullName());
        response.setEmail(faculty.getEmail());
        response.setPhone(faculty.getPhone());
        response.setDepartmentName(faculty.getDepartment() != null ? 
                faculty.getDepartment().getDepartmentName() : "Not Assigned");
        response.setDesignation(faculty.getDesignation());
        response.setUtilizationPercentage(faculty.getUtilizationPercentage());
        response.setPunctualityPercentage(faculty.getPunctualityPercentage());
        response.setStatus(faculty.getStatus().name());
        response.setLastActive(faculty.getLastActive());
        response.setWeeklyWorkloadHours(faculty.getWeeklyWorkloadHours());
        response.setIdleHours(faculty.getIdleHours());
        response.setRating(faculty.getRating());
        
        // Convert subjects
        if (faculty.getSubjects() != null) {
            response.setSubjects(faculty.getSubjects().stream()
                    .map(Subject::getSubjectName)
                    .collect(Collectors.toList()));
        }
        
        return response;
    }
    
    private FacultyDetailResponse convertToDetailResponse(Faculty faculty) {
        FacultyDetailResponse response = new FacultyDetailResponse();
        
        // Core Identity
        response.setPublicId(faculty.getPublicId());
        response.setFacultyId(faculty.getFacultyId());
        response.setEmail(faculty.getEmail());
        
        // Basic Profile
        response.setFullName(faculty.getFullName());
        response.setPhone(faculty.getPhone());
        response.setGender(faculty.getGender() != null ? faculty.getGender().name() : null);
        response.setDateOfBirth(faculty.getDateOfBirth());
        response.setBloodGroup(faculty.getBloodGroup());
        response.setAddress(faculty.getAddress());
        response.setCity(faculty.getCity());
        response.setState(faculty.getState());
        response.setPincode(faculty.getPincode());
        response.setEmergencyContact(faculty.getEmergencyContact());
        response.setAlternatePhone(faculty.getAlternatePhone());
        response.setMaritalStatus(faculty.getMaritalStatus());
        response.setNationality(faculty.getNationality());
        
        // Academic Details
        if (faculty.getDepartment() != null) {
            response.setDepartmentName(faculty.getDepartment().getDepartmentName());
        }
        response.setDesignation(faculty.getDesignation());
        response.setQualification(faculty.getQualification());
        response.setSpecialization(faculty.getSpecialization());
        response.setExperienceYears(faculty.getExperienceYears());
        response.setResearchArea(faculty.getResearchArea());
        response.setYearOfPassing(faculty.getYearOfPassing());
        response.setInstitutionName(faculty.getInstitutionName());
        
        // Employment
        response.setJoinDate(faculty.getJoinDate());
        response.setEmploymentType(faculty.getEmploymentType() != null ? 
                faculty.getEmploymentType().name() : null);
        response.setSalaryGrade(faculty.getSalaryGrade());
        
        // Status
        response.setStatus(faculty.getStatus().name());
        response.setAccountLocked(faculty.getAccountLocked());
        
        // Performance Metrics
        response.setUtilizationPercentage(faculty.getUtilizationPercentage());
        response.setPunctualityPercentage(faculty.getPunctualityPercentage());
        response.setPerformanceScore(faculty.getPerformanceScore());
        response.setAttendancePercentage(faculty.getAttendancePercentage());
        response.setRating(faculty.getRating());
        
        // Workload
        response.setWeeklyWorkloadHours(faculty.getWeeklyWorkloadHours());
        response.setIdleHours(faculty.getIdleHours());
        response.setMaxWorkloadHours(faculty.getMaxWorkloadHours());
        
        // Leave Management
        response.setLeavesTaken(faculty.getLeavesTaken());
        response.setLeavesAvailable(faculty.getLeavesAvailable());
        response.setMedicalLeavesAvailable(faculty.getMedicalLeavesAvailable());
        response.setCasualLeavesAvailable(faculty.getCasualLeavesAvailable());
        
        // Financial
        response.setAccountNumber(faculty.getAccountNumber());
        response.setBankName(faculty.getBankName());
        response.setIfscCode(faculty.getIfscCode());
        response.setPanNumber(faculty.getPanNumber());
        response.setUanNumber(faculty.getUanNumber());
        
        // Research
        response.setResearchPapersCount(faculty.getResearchPapersCount());
        response.setConferencesAttended(faculty.getConferencesAttended());
        response.setProjectsCompleted(faculty.getProjectsCompleted());
        response.setPublicationsCount(faculty.getPublicationsCount());
        
        // Related Data
        if (faculty.getSubjects() != null) {
            response.setSubjects(faculty.getSubjects().stream()
                    .map(Subject::getSubjectName)
                    .collect(Collectors.toList()));
        }
        
        // Permissions
        FacultyPermissions permissions = permissionsRepository.findByFacultyId(faculty.getId())
                .orElseGet(() -> createDefaultPermissions(faculty));
        response.setPermissions(convertPermissionsToMap(permissions));
        
        // Documents
        List<DocumentResponse> documents = facultyDocumentRepository.findByFacultyId(faculty.getId())
                .stream()
                .map(this::convertToDocumentResponse)
                .collect(Collectors.toList());
        response.setDocuments(documents);
        
        // Activity
        response.setLastActive(faculty.getLastActive());
        response.setCreatedAt(faculty.getCreatedAt());
        response.setUpdatedAt(faculty.getUpdatedAt());
        
        return response;
    }
    
    private DocumentResponse convertToDocumentResponse(FacultyDocument document) {
        DocumentResponse response = new DocumentResponse();
        response.setId(document.getId());
        response.setDocumentName(document.getDocumentName());
        response.setDocumentType(document.getDocumentType());
        response.setCategory(document.getCategory());
        response.setFileSize(document.getFileSize());
        response.setUploadedAt(document.getUploadedAt());
        response.setVerified(document.getVerified());
        response.setVerifiedByAdminId(document.getVerifiedByAdminId());
        response.setVerificationDate(document.getVerificationDate());
        return response;
    }
    
    private Map<String, Boolean> convertPermissionsToMap(FacultyPermissions permissions) {
        Map<String, Boolean> map = new HashMap<>();
        map.put("attendanceAccess", permissions.getAttendanceAccess());
        map.put("studentManagement", permissions.getStudentManagement());
        map.put("marksEntry", permissions.getMarksEntry());
        map.put("courseCreation", permissions.getCourseCreation());
        map.put("examManagement", permissions.getExamManagement());
        map.put("leaveApproval", permissions.getLeaveApproval());
        map.put("noticeBoardAccess", permissions.getNoticeBoardAccess());
        map.put("analyticsAccess", permissions.getAnalyticsAccess());
        map.put("adminAccess", permissions.getAdminAccess());
        return map;
    }


    public List<FacultyResponse> getFacultyByStatus(Long institutionId, String status) {
        try {
            FacultyStatus facultyStatus = FacultyStatus.valueOf(status.toUpperCase());
            List<Faculty> facultyList = facultyRepository.findByInstitutionIdAndStatus(institutionId, facultyStatus);
            return facultyList.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status value");
        }
    }

    public List<FacultyResponse> getFacultyByDepartment(Long institutionId, String departmentCode) {
        Department department = departmentRepository
                .findByInstitutionIdAndDepartmentCode(institutionId, departmentCode)
                .orElseThrow(() -> new BadRequestException("Department not found"));
        
        List<Faculty> facultyList = facultyRepository.findByDepartmentId(department.getId());
        return facultyList.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


public List<FacultyResponse> filterFaculty(Long institutionId, 
                                          String status, 
                                          String departmentCode, 
                                          String utilizationRange,
                                          String searchQuery) {
    
    // Parse utilization range
    Integer minUtilization = null;
    Integer maxUtilization = null;
    
    if (utilizationRange != null && !utilizationRange.equals("all")) {
        switch (utilizationRange.toLowerCase()) {
            case "high":
                minUtilization = 90;
                maxUtilization = 100;
                break;
            case "medium":
                minUtilization = 70;
                maxUtilization = 89;
                break;
            case "low":
                minUtilization = 0;
                maxUtilization = 69;
                break;
        }
    }
    
    // Get department ID if department filter is active
    Long departmentId = null;
    if (departmentCode != null && !departmentCode.equals("all")) {
        try {
            Department department = departmentRepository
                .findByInstitutionIdAndDepartmentCode(institutionId, departmentCode)
                .orElse(null);
            if (department != null) {
                departmentId = department.getId();
            }
        } catch (Exception e) {
            // Department not found, will handle in query
        }
    }
    
    // Get filtered faculty from database
    List<Faculty> facultyList = facultyRepository.findByInstitutionIdAndFilters(
        institutionId,
        (status != null && !status.equals("all")) ? status : null,
        departmentId,
        minUtilization,
        maxUtilization
    );
    
    // Apply search filter if needed
    List<Faculty> filteredList = facultyList;
    if (searchQuery != null && !searchQuery.trim().isEmpty()) {
        String query = searchQuery.toLowerCase();
        filteredList = facultyList.stream()
            .filter(faculty -> {
                return (faculty.getFullName() != null && faculty.getFullName().toLowerCase().contains(query)) ||
                       (faculty.getFacultyId() != null && faculty.getFacultyId().toLowerCase().contains(query)) ||
                       (faculty.getEmail() != null && faculty.getEmail().toLowerCase().contains(query)) ||
                       (faculty.getDepartment() != null && 
                        faculty.getDepartment().getDepartmentName() != null &&
                        faculty.getDepartment().getDepartmentName().toLowerCase().contains(query));
            })
            .collect(Collectors.toList());
    }
    
    return filteredList.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
}


    @Transactional
    public void updateFacultyPerformance(String publicId, Integer utilizationPercentage, 
                                        Integer punctualityPercentage, Integer performanceScore,
                                        Integer attendancePercentage, Double rating, Long institutionId) {
        Faculty faculty = facultyRepository.findByPublicId(publicId)
                .orElseThrow(() -> new BadRequestException("Faculty not found"));
        
        if (!faculty.getInstitution().getId().equals(institutionId)) {
            throw new BadRequestException("Faculty not found in your institution");
        }
        
        if (utilizationPercentage != null) faculty.setUtilizationPercentage(utilizationPercentage);
        if (punctualityPercentage != null) faculty.setPunctualityPercentage(punctualityPercentage);
        if (performanceScore != null) faculty.setPerformanceScore(performanceScore);
        if (attendancePercentage != null) faculty.setAttendancePercentage(attendancePercentage);
        if (rating != null) faculty.setRating(rating);
        
        facultyRepository.save(faculty);
    }

    @Transactional
    public void updateWorkload(String publicId, Integer weeklyWorkloadHours, 
                            Integer idleHours, Long institutionId) {
        Faculty faculty = facultyRepository.findByPublicId(publicId)
                .orElseThrow(() -> new BadRequestException("Faculty not found"));
        
        if (!faculty.getInstitution().getId().equals(institutionId)) {
            throw new BadRequestException("Faculty not found in your institution");
        }
        
        if (weeklyWorkloadHours != null) faculty.setWeeklyWorkloadHours(weeklyWorkloadHours);
        if (idleHours != null) faculty.setIdleHours(idleHours);
        
        facultyRepository.save(faculty);
    }

    @Transactional
    public void updateLeaves(String publicId, Integer leavesTaken, Integer leavesAvailable,
                            Integer medicalLeavesAvailable, Integer casualLeavesAvailable,
                            Long institutionId) {
        Faculty faculty = facultyRepository.findByPublicId(publicId)
                .orElseThrow(() -> new BadRequestException("Faculty not found"));
        
        if (!faculty.getInstitution().getId().equals(institutionId)) {
            throw new BadRequestException("Faculty not found in your institution");
        }
        
        if (leavesTaken != null) faculty.setLeavesTaken(leavesTaken);
        if (leavesAvailable != null) faculty.setLeavesAvailable(leavesAvailable);
        if (medicalLeavesAvailable != null) faculty.setMedicalLeavesAvailable(medicalLeavesAvailable);
        if (casualLeavesAvailable != null) faculty.setCasualLeavesAvailable(casualLeavesAvailable);
        
        facultyRepository.save(faculty);
    }


}