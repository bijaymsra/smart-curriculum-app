package com.attenza.backend.timetable.repository;

import com.attenza.backend.timetable.entity.StudentGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentGroupRepository extends JpaRepository<StudentGroup, Long> {

    Optional<StudentGroup> findByInstitutionIdAndDepartmentIdAndCourseAndBatchAndSemesterAndSection(
        Long institutionId,
        Long departmentId,
        String course,
        String batch,
        Integer semester,
        String section
    );

    List<StudentGroup> findAllByInstitutionId(Long institutionId);
}
