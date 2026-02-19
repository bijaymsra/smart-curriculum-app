package com.attenza.backend.repository.faculty;

import com.attenza.backend.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;


@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    Optional<Department> findByDepartmentCode(String departmentCode);

    List<Department> findByInstitutionId(Long institutionId);

    boolean existsByDepartmentCodeAndInstitutionId(
        String departmentCode,
        Long institutionId
    );

    // ✅ Used by FacultyService (DO NOT REMOVE)
    Optional<Department> findByInstitutionIdAndDepartmentCode(
        Long institutionId,
        String departmentCode
    );

    // ✅ Used by StudentGroupService / StudentService
    Optional<Department> findByDepartmentCodeAndInstitution_Id(
        String departmentCode,
        Long institutionId
    );

    Optional<Department> findByDepartmentName(String departmentName);



}
