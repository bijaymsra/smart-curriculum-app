package com.attenza.backend.util;

import org.springframework.stereotype.Component;

import java.time.Year;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public final class IdGenerator {

    private IdGenerator() {
        // prevent instantiation
    }

    // ================= ADMIN =================
    public static String generateAdminPublicId() {
        return "ADM-" + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 12)
                .toUpperCase();
    }

    // ================= INSTITUTION =================
    public static String generateInstitutionPublicId() {
        return "INS-" + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 12)
                .toUpperCase();
    }

    // ================= FACULTY =================
    public static String generateFacultyId() {
        return "FAC" + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 5)
                .toUpperCase();
        // Example: FACA92F
    }

    /**
     * Used internally for first-time faculty activation.
     * Plain password is NEVER stored, only emailed once.
     */
    public static String generateTempPassword() {
        return generateRandomPassword();
    }

    public static String generateRandomPassword() {
        return UUID.randomUUID()
                .toString()
                .substring(0, 8);
    }

    // ================= STUDENT (TEMP VERSION) =================
    private final AtomicInteger sequence = new AtomicInteger(9000);

    public String generateStudentRegistrationNo(Long institutionId) {
        int year = Year.now().getValue() % 100;
        int next = sequence.incrementAndGet();

        return String.format("%02d%03d%04d", year, institutionId, next);
    }

    public String generatePublicStudentId(String regNo) {
        return "STU-" + regNo;
    }

    // ================= ATTENDANCE =================
    public static String generateAttendanceSessionId() {
        return "ATT-" + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 8)
                .toUpperCase();
    }

}
