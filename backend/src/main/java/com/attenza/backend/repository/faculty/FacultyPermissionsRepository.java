package com.attenza.backend.repository.faculty;

import com.attenza.backend.entity.FacultyPermissions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FacultyPermissionsRepository extends JpaRepository<FacultyPermissions, Long> {
    Optional<FacultyPermissions> findByFacultyId(Long facultyId);
    Optional<FacultyPermissions> findByFacultyPublicId(String facultyPublicId);
}