package com.attenza.backend.service.faculty.settings;

import com.attenza.backend.entity.Faculty;
import com.attenza.backend.dto.faculty.settings.FacultyProfileUpdateRequest;
import com.attenza.backend.dto.faculty.settings.FacultySettingsResponse;
import com.attenza.backend.repository.faculty.FacultyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
public class FacultySettingsService {

    private final FacultyRepository facultyRepository;

    public FacultySettingsResponse getMySettings(String facultyId) {

        Faculty faculty = facultyRepository
                .findByFacultyId(facultyId)
                .orElseThrow(() ->
                        new RuntimeException("Faculty not found"));

        return FacultySettingsResponse.builder()
                .facultyId(faculty.getFacultyId())
                .fullName(faculty.getFullName())
                .designation(faculty.getDesignation())
                .departmentName(
                        faculty.getDepartment() != null
                                ? faculty.getDepartment().getDepartmentName()
                                : null
                )
                .institutionName(faculty.getInstitutionName())
                .employmentType(
                        faculty.getEmploymentType() != null
                                ? faculty.getEmploymentType().name()
                                : null
                )
                .joinDate(
                        faculty.getJoinDate() != null
                                ? faculty.getJoinDate().toString()
                                : null
                )

                /* Editable */
                .phone(faculty.getPhone())
                .alternatePhone(faculty.getAlternatePhone())
                .address(faculty.getAddress())
                .city(faculty.getCity())
                .state(faculty.getState())
                .pincode(faculty.getPincode())
                .emergencyContact(faculty.getEmergencyContact())

                /* Leave */
                .leavesAvailable(faculty.getLeavesAvailable())
                .leavesTaken(faculty.getLeavesTaken())
                .casualLeavesAvailable(faculty.getCasualLeavesAvailable())
                .medicalLeavesAvailable(faculty.getMedicalLeavesAvailable())

                /* Workload */
                .weeklyWorkloadHours(faculty.getWeeklyWorkloadHours())
                .maxWorkloadHours(faculty.getMaxWorkloadHours())
                .utilizationPercentage(faculty.getUtilizationPercentage())

                /* Account */
                .status(faculty.getStatus().name())
                .lastActive(
                        faculty.getLastActive() != null
                                ? faculty.getLastActive().toString()
                                : null
                )
                .build();
    }


    public void updateMyProfile(
            String facultyId,
            FacultyProfileUpdateRequest request
    ) {

        Faculty faculty = facultyRepository
                .findByFacultyId(facultyId)
                .orElseThrow(() ->
                        new RuntimeException("Faculty not found"));

        faculty.setPhone(request.getPhone());
        faculty.setAlternatePhone(request.getAlternatePhone());
        faculty.setAddress(request.getAddress());
        faculty.setCity(request.getCity());
        faculty.setState(request.getState());
        faculty.setPincode(request.getPincode());
        faculty.setEmergencyContact(request.getEmergencyContact());

        facultyRepository.save(faculty);
    }
}
