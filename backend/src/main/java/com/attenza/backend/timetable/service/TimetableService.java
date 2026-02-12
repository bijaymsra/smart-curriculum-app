package com.attenza.backend.timetable.service;

import com.attenza.backend.exception.BadRequestException;
import com.attenza.backend.timetable.dto.TimetableCreateRequest;
import com.attenza.backend.timetable.entity.*;
import com.attenza.backend.timetable.repository.CourseOfferingRepository;
import com.attenza.backend.timetable.repository.RoomRepository;
import com.attenza.backend.timetable.repository.TimeSlotRepository;
import com.attenza.backend.timetable.repository.TimetableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.attenza.backend.timetable.service.StudentGroupService;
import com.attenza.backend.timetable.dto.TimetableResponse;
import com.attenza.backend.attendance.repository.AttendanceSessionRepository;



import java.util.List;

@Service
@RequiredArgsConstructor
public class TimetableService {

    private final TimetableRepository timetableRepository;
    private final CourseOfferingRepository courseOfferingRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final RoomRepository roomRepository;
    private final StudentGroupService studentGroupService;
    private final AttendanceSessionRepository attendanceSessionRepository;



    /* =========================
    UPDATE TIMETABLE ENTRY
    ========================= */
    public TimetableEntry update(Long id, TimetableCreateRequest request) {

        TimetableEntry entry = timetableRepository.findById(id)
            .orElseThrow(() -> new BadRequestException("Timetable entry not found"));

        TimeSlot timeSlot = timeSlotRepository.findById(
                request.getTimeSlotId()
        ).orElseThrow(() -> new BadRequestException("Time slot not found"));

        Room room = roomRepository.findById(
                request.getRoomId()
        ).orElseThrow(() -> new BadRequestException("Room not found"));

        // Capacity safety (same as create)
        if (room.getCapacity() <= 0) {
            throw new BadRequestException("Room capacity invalid");
        }

        /*
        🔒 ADMIN RULE (IMPORTANT)
        We do NOT allow changing:
        - studentGroup
        - courseOffering
        - faculty
        */

        entry.setTimeSlot(timeSlot);
        entry.setRoom(room);

        return timetableRepository.save(entry);
    }


    /* =========================
       CREATE TIMETABLE ENTRY
       ========================= */
    public TimetableEntry create(TimetableCreateRequest request) {

        CourseOffering offering = courseOfferingRepository.findById(
                request.getCourseOfferingId()
        ).orElseThrow(() -> new BadRequestException("Course offering not found"));

        TimeSlot timeSlot = timeSlotRepository.findById(
                request.getTimeSlotId()
        ).orElseThrow(() -> new BadRequestException("Time slot not found"));

        Room room = roomRepository.findById(
                request.getRoomId()
        ).orElseThrow(() -> new BadRequestException("Room not found"));

        // Capacity check (basic safety)
        if (room.getCapacity() <= 0) {
            throw new BadRequestException("Room capacity invalid");
        }

        // 🚨 IMPORTANT (future-proofing)
        // Conflict checks will be added here later:
        // - Same room + same timeslot
        // - Same faculty + same timeslot
        // - Same student group + same timeslot

        TimetableEntry entry = new TimetableEntry();
        entry.setCourseOffering(offering);
        entry.setStudentGroup(offering.getStudentGroup());
        entry.setFaculty(offering.getFaculty());
        entry.setTimeSlot(timeSlot);
        entry.setRoom(room);

        return timetableRepository.save(entry);
    }

    /* =========================
       READ APIs (FOR UI)
       ========================= */

    public List<TimetableEntry> getAll() {
        return timetableRepository.findAll();
    }

    public List<TimetableEntry> getByStudentGroup(Long studentGroupId) {
        return timetableRepository.findByStudentGroup_Id(studentGroupId);
    }

    public List<TimetableEntry> getByFaculty(Long facultyId) {
        return timetableRepository.findByFaculty_Id(facultyId);
    }

    public List<TimetableEntry> getByRoom(Long roomId) {
        return timetableRepository.findByRoom_Id(roomId);
    }


    public void delete(Long id) {
        if (!timetableRepository.existsById(id)) {
            throw new BadRequestException("Timetable entry not found");
        }
        timetableRepository.deleteById(id);
    }

public List<TimetableResponse> getAllForUI() {

    List<TimetableEntry> entries = timetableRepository.findAll();

    return entries.stream().map(entry -> {

        TimetableResponse res = new TimetableResponse();

        res.setTimetableId(entry.getId());

        res.setSubjectCode(
                entry.getCourseOffering().getSubject().getSubjectCode()
        );
        res.setSubjectName(
                entry.getCourseOffering().getSubject().getSubjectName()
        );

        res.setFacultyId(
                entry.getFaculty().getFacultyId()
        );
        res.setFacultyName(
                entry.getFaculty().getFullName()
        );

        res.setSection(
                entry.getStudentGroup().getSection()
        );
        res.setSemester(
                entry.getStudentGroup().getSemester()
        );
        res.setBatch(
                entry.getStudentGroup().getBatch()
        );

        res.setDay(
                entry.getTimeSlot()
                        .getDayOfWeek()
                        .name()
                        .substring(0, 1)
                        + entry.getTimeSlot().getDayOfWeek().name().substring(1).toLowerCase()
        );

        res.setTime(
                entry.getTimeSlot().getStartTime() + " - " +
                        entry.getTimeSlot().getEndTime()
        );

        res.setRoomCode(
                entry.getRoom().getRoomCode()
        );

        long count = studentGroupService.getStudentCount(
                entry.getStudentGroup()
        );
        res.setTotalStudents((int) count);

        // 🔥 NEW PART — Fetch latest attendance session
        attendanceSessionRepository
                .findTopByClassIdOrderByStartTimeDesc(entry.getId())
                .ifPresent(session ->
                        res.setAttendanceStatus(session.getStatus().name())
                );

        return res;

    }).toList();
}



}
