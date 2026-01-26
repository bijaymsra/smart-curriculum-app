package com.attenza.backend.timetable.service;

import com.attenza.backend.entity.Department;
import com.attenza.backend.entity.Institution;
import com.attenza.backend.exception.BadRequestException;
import com.attenza.backend.repository.admin.InstitutionRepository;
import com.attenza.backend.repository.faculty.DepartmentRepository;
import com.attenza.backend.timetable.dto.StudentGroupCreateRequest;
import com.attenza.backend.timetable.entity.StudentGroup;
import com.attenza.backend.timetable.repository.StudentGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.attenza.backend.repository.admin.StudentRepository;
import org.springframework.transaction.annotation.Transactional;



@Service
@RequiredArgsConstructor
public class StudentGroupService {

    private final StudentGroupRepository studentGroupRepository;
    private final InstitutionRepository institutionRepository;
    private final DepartmentRepository departmentRepository;
    private final StudentRepository studentRepository;

    public StudentGroup create(StudentGroupCreateRequest request) {

        Institution institution = institutionRepository.findById(request.getInstitutionId())
            .orElseThrow(() -> new BadRequestException("Institution not found"));

        Department department = departmentRepository.findById(request.getDepartmentId())
            .orElseThrow(() -> new BadRequestException("Department not found"));

        studentGroupRepository
            .findByInstitutionIdAndDepartmentIdAndCourseAndBatchAndSemesterAndSection(
                request.getInstitutionId(),
                request.getDepartmentId(),
                request.getCourse(),
                request.getBatch(),
                request.getSemester(),
                request.getSection()
            )
            .ifPresent(g -> {
                throw new BadRequestException("Student group already exists");
            });

        StudentGroup group = new StudentGroup();
        group.setInstitution(institution);
        group.setDepartment(department);
        group.setCourse(request.getCourse());
        group.setBatch(request.getBatch());
        group.setSemester(request.getSemester());
        group.setSection(request.getSection());

        return studentGroupRepository.save(group);
    }

    private long resolveStudentCount(StudentGroup group) {

    if (group.getInstitution() == null || group.getDepartment() == null) {
        return 0;
    }

    return studentRepository
        .countByInstitution_IdAndCourseAndBatchAndSemesterAndSectionAndDepartmentAndStatusIn(
            group.getInstitution().getId(),
            group.getCourse(),
            group.getBatch(),
            group.getSemester(),
            group.getSection(),
            group.getDepartment().getDepartmentCode(),
            java.util.List.of(
                com.attenza.backend.entity.StudentStatus.ACTIVE,
                com.attenza.backend.entity.StudentStatus.WARNING,
                com.attenza.backend.entity.StudentStatus.SUSPENDED
            )
        );
}



    @Transactional(readOnly = true)
    public java.util.List<StudentGroup> getAllByInstitution(Long institutionId) {
        var groups = studentGroupRepository.findAllByInstitutionId(institutionId);

        groups.forEach(group ->
            group.setStudentCount(resolveStudentCount(group))
        );

        return groups;
    }


    @Transactional
    public StudentGroup findOrCreateGroupFromStudent(
            Institution institution,
            Department department,
            String course,
            String batch,
            Integer semester,
            String section
    ) {
        if (institution == null || department == null) {
            throw new IllegalArgumentException("Institution and Department must not be null");
        }

        return studentGroupRepository
            .findByInstitutionIdAndDepartmentIdAndCourseAndBatchAndSemesterAndSection(
                institution.getId(),
                department.getId(),
                course,
                batch,
                semester,
                section
            )
            .orElseGet(() -> {
                StudentGroup group = new StudentGroup();
                group.setInstitution(institution);
                group.setDepartment(department);
                group.setCourse(course);
                group.setBatch(batch);
                group.setSemester(semester);
                group.setSection(section);

                return studentGroupRepository.save(group);
            });
    }


    @Transactional(readOnly = true)
    public long getStudentCount(StudentGroup group) {
        return resolveStudentCount(group);
    }

}
