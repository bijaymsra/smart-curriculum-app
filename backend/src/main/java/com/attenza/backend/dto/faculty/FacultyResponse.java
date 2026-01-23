package com.attenza.backend.dto.faculty;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class FacultyResponse {
    private String publicId;
    private String facultyId;
    private String fullName;
    private String email;
    private String phone;
    private String departmentName;
    private String designation;
    private Integer utilizationPercentage;
    private Integer punctualityPercentage;
    private String status;
    private LocalDateTime lastActive;
    private List<String> subjects;
    private Integer weeklyWorkloadHours;
    private Integer idleHours;
    private Double rating;
    
    // Helper method to get workload display
    public String getWorkload() {
        return weeklyWorkloadHours + " hrs/week";
    }
}