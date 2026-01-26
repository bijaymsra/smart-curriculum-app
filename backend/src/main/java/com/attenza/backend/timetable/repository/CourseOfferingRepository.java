package com.attenza.backend.timetable.repository;

import com.attenza.backend.timetable.entity.CourseOffering;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourseOfferingRepository
        extends JpaRepository<CourseOffering, Long> {

    Optional<CourseOffering> findByStudentGroupIdAndSubjectId(
            Long studentGroupId,
            Long subjectId
    );
}
