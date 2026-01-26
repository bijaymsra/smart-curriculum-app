package com.attenza.backend.timetable.service;

import com.attenza.backend.entity.Faculty;
import com.attenza.backend.entity.Subject;
import com.attenza.backend.exception.BadRequestException;
import com.attenza.backend.repository.faculty.FacultyRepository;
import com.attenza.backend.repository.faculty.SubjectRepository;
import com.attenza.backend.timetable.dto.CourseOfferingRequest;
import com.attenza.backend.timetable.entity.CourseOffering;
import com.attenza.backend.timetable.entity.StudentGroup;
import com.attenza.backend.timetable.repository.CourseOfferingRepository;
import com.attenza.backend.timetable.repository.StudentGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CourseOfferingService {

    private final CourseOfferingRepository courseOfferingRepository;
    private final StudentGroupRepository studentGroupRepository;
    private final SubjectRepository subjectRepository;
    private final FacultyRepository facultyRepository;

    public CourseOffering create(CourseOfferingRequest request) {

        StudentGroup group = studentGroupRepository.findById(request.getStudentGroupId())
            .orElseThrow(() -> new BadRequestException("Student group not found"));

        Subject subject = subjectRepository.findById(request.getSubjectId())
            .orElseThrow(() -> new BadRequestException("Subject not found"));

        Faculty faculty = facultyRepository.findById(request.getFacultyId())
            .orElseThrow(() -> new BadRequestException("Faculty not found"));

        courseOfferingRepository
            .findByStudentGroupIdAndSubjectId(
                request.getStudentGroupId(),
                request.getSubjectId()
            )
            .ifPresent(co -> {
                throw new BadRequestException("Subject already assigned to this group");
            });

        CourseOffering offering = new CourseOffering();
        offering.setStudentGroup(group);
        offering.setSubject(subject);
        offering.setFaculty(faculty);

        return courseOfferingRepository.save(offering);
    }
}
