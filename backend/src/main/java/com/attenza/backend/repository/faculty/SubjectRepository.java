package com.attenza.backend.repository.faculty;

import com.attenza.backend.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByDepartmentId(Long departmentId);
    List<Subject> findByDepartmentInstitutionId(Long institutionId);
    Optional<Subject> findBySubjectCode(String subjectCode);
}