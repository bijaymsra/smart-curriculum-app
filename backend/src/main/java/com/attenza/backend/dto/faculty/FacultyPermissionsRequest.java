package com.attenza.backend.dto.faculty;

import lombok.Data;

@Data
public class FacultyPermissionsRequest {
    private Boolean attendanceAccess;
    private Boolean studentManagement;
    private Boolean marksEntry;
    private Boolean courseCreation;
    private Boolean examManagement;
    private Boolean leaveApproval;
    private Boolean noticeBoardAccess;
    private Boolean analyticsAccess;
    private Boolean adminAccess;
}