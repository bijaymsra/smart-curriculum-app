package com.attenza.backend.timetable.repository;

import com.attenza.backend.timetable.entity.TimetableEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimetableRepository extends JpaRepository<TimetableEntry, Long> {

    List<TimetableEntry> findByFaculty_Id(Long facultyId);

    List<TimetableEntry> findByStudentGroup_Id(Long studentGroupId);

    List<TimetableEntry> findByRoom_Id(Long roomId);
}

