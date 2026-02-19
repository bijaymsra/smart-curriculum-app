package com.attenza.backend.ai.service;

import com.attenza.backend.ai.model.AISlot;
import com.attenza.backend.ai.model.AITimetableEntry;
import com.attenza.backend.entity.Department;
import com.attenza.backend.entity.Student;
import com.attenza.backend.repository.admin.StudentRepository;
import com.attenza.backend.timetable.entity.StudentGroup;
import com.attenza.backend.timetable.entity.TimeSlot;
import com.attenza.backend.timetable.entity.TimetableEntry;
import com.attenza.backend.timetable.repository.StudentGroupRepository;
import com.attenza.backend.timetable.repository.TimetableRepository;
import com.attenza.backend.repository.faculty.DepartmentRepository;
import com.attenza.backend.entity.Department;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AITimetableLoaderService {

    private final TimetableRepository timetableRepository;
    private final StudentRepository studentRepository;
    private final StudentGroupRepository studentGroupRepository;
    private final DepartmentRepository departmentRepository;


    public List<AITimetableEntry> loadFacultySchedule(Long facultyId) {

        List<TimetableEntry> entries =
                timetableRepository.findByFaculty_Id(facultyId);

        return entries.stream()
                .map(this::convertToAIModel)
                .toList();
    }

    public List<AITimetableEntry> loadStudentSchedule(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));




        Optional<StudentGroup> groupOpt =
                studentGroupRepository
                        .findByInstitutionIdAndCourseAndBatchAndSemesterAndSection(
                                student.getInstitution().getId(),
                                student.getCourse(),
                                student.getBatch(),
                                student.getSemester(),
                                student.getSection()
                        );


        if (groupOpt.isEmpty()) {
            return List.of();
        }

        Long groupId = groupOpt.get().getId();

        List<TimetableEntry> entries =
                timetableRepository.findByStudentGroup_Id(groupId);

        return entries.stream()
                .map(this::convertToAIModel)
                .toList();
    }

    private AITimetableEntry convertToAIModel(TimetableEntry entity) {

        TimeSlot slot = entity.getTimeSlot();

        AISlot aiSlot = AISlot.builder()
                .timeSlotId(slot.getId())
                .dayOfWeek(slot.getDayOfWeek())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .build();

        return AITimetableEntry.builder()
                .entryId(entity.getId())
                .facultyId(entity.getFaculty().getId())
                .studentGroupId(entity.getStudentGroup().getId())
                .roomId(entity.getRoom().getId())
                .slot(aiSlot)
                .build();
    }
}
