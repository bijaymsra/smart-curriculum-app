package com.attenza.backend.student.tasks.repository;

import com.attenza.backend.student.tasks.entity.StudentTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentTaskRepository extends JpaRepository<StudentTask, Long> {

    List<StudentTask> findByStudentIdOrderByDueDateAsc(Long studentId);

    long countByStudentId(Long studentId);

    long countByStudentIdAndCompletedTrue(Long studentId);

    long countByStudentIdAndCompletedFalse(Long studentId);
}
