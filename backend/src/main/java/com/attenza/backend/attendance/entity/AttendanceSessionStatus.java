package com.attenza.backend.attendance.entity;

public enum AttendanceSessionStatus {

    ACTIVE,       // session running
    EXPIRED,      // auto expired by time
    CANCELLED,    // faculty cancelled
    FINALIZED     // faculty locked permanently

}
