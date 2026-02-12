package com.attenza.backend.service.faculty;

import com.attenza.backend.dto.faculty.FacultyDashboardResponse;
import com.attenza.backend.dto.faculty.TodayClassDTO;
import com.attenza.backend.entity.Faculty;
import com.attenza.backend.repository.faculty.FacultyRepository;
import com.attenza.backend.attendance.repository.AttendanceSessionRepository;
import com.attenza.backend.attendance.entity.AttendanceSessionStatus;
import com.attenza.backend.timetable.repository.TimetableRepository;
import com.attenza.backend.timetable.entity.TimetableEntry;
import com.attenza.backend.dto.faculty.FacultyInsightDTO;
import java.util.ArrayList;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacultyDashboardService {

    private final FacultyRepository facultyRepository;
    private final AttendanceSessionRepository attendanceSessionRepository;
    private final TimetableRepository timetableRepository;

    public FacultyDashboardResponse getDashboard(String facultyId) {

        // 🔎 Clean & Debug Input
        String cleanedFacultyId = facultyId == null ? null : facultyId.trim();
        System.out.println("Dashboard request facultyId: [" + cleanedFacultyId + "]");

        if (cleanedFacultyId == null || cleanedFacultyId.isEmpty()) {
            throw new RuntimeException("Invalid faculty ID");
        }

        // ✅ Fetch faculty using official facultyId (FACB8553)
        Faculty faculty = facultyRepository
                .findByFacultyId(cleanedFacultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        // ✅ Get today's DayOfWeek ENUM
        DayOfWeek today = LocalDate.now().getDayOfWeek();

        // ✅ Fetch timetable entries using numeric DB ID
        List<TimetableEntry> allEntries =
                timetableRepository.findByFaculty_Id(faculty.getId());

        // ✅ Filter today classes
        List<TodayClassDTO> todayClasses = allEntries.stream()
                .filter(entry ->
                        entry.getTimeSlot() != null &&
                        entry.getTimeSlot().getDayOfWeek() == today
                )
                .map(entry -> new TodayClassDTO(
                        entry.getId(),
                        entry.getCourseOffering().getSubject().getSubjectCode(),
                        entry.getCourseOffering().getSubject().getSubjectName(),
                        entry.getTimeSlot().getLabel(),
                        entry.getRoom().getRoomCode(),
                        entry.getStudentGroup() != null
                                ? entry.getStudentGroup().getSemester()
                                : null,
                        null
                ))
                .collect(Collectors.toList());

        int todayClassesCount = todayClasses.size();

        // ✅ Count finalized sessions
        long totalSessionsConducted =
                attendanceSessionRepository.countByFacultyIdAndStatus(
                        faculty.getFacultyId(),
                        AttendanceSessionStatus.FINALIZED
                );

        // ✅ Check active session
        boolean activeSession =
                attendanceSessionRepository.existsByFacultyIdAndExpiryTimeAfter(
                        faculty.getFacultyId(),
                        LocalDateTime.now()
                );

        int profileCompletion = calculateProfileCompletion(faculty);

        return new FacultyDashboardResponse(
                todayClassesCount,
                totalSessionsConducted,
                activeSession,
                profileCompletion,
                todayClasses
        );
    }

    private int calculateProfileCompletion(Faculty faculty) {

        int totalFields = 6;
        int filled = 0;

        if (faculty.getAddress() != null && !faculty.getAddress().isEmpty()) filled++;
        if (faculty.getQualification() != null && !faculty.getQualification().isEmpty()) filled++;
        if (faculty.getSpecialization() != null && !faculty.getSpecialization().isEmpty()) filled++;
        if (faculty.getEmergencyContact() != null && !faculty.getEmergencyContact().isEmpty()) filled++;
        if (faculty.getResearchArea() != null && !faculty.getResearchArea().isEmpty()) filled++;
        if (faculty.getPhone() != null && !faculty.getPhone().isEmpty()) filled++;

        return (filled * 100) / totalFields;
    }


    public List<FacultyInsightDTO> generateInsights(String facultyId) {

    List<FacultyInsightDTO> insights = new ArrayList<>();

    // Example logic (temporary demo logic)
    long totalSessions =
            attendanceSessionRepository.countByFacultyIdAndStatus(
                    facultyId,
                    AttendanceSessionStatus.FINALIZED
            );

    if (totalSessions > 5) {
        insights.add(new FacultyInsightDTO(
                "success",
                "Consistent Teaching Activity",
                "You have successfully conducted " + totalSessions + " sessions.",
                "View Analytics"
        ));
    }

    // Example warning
    if (totalSessions == 0) {
        insights.add(new FacultyInsightDTO(
                "warning",
                "No Sessions Conducted",
                "You haven't conducted any attendance sessions yet.",
                "Start Session"
        ));
    }

    return insights;
}

}
