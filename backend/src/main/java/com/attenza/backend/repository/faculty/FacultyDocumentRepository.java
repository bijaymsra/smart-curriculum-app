package com.attenza.backend.repository.faculty;

import com.attenza.backend.entity.FacultyDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FacultyDocumentRepository extends JpaRepository<FacultyDocument, Long> {
    List<FacultyDocument> findByFacultyId(Long facultyId);
    List<FacultyDocument> findByFacultyPublicId(String facultyPublicId);
    List<FacultyDocument> findByFacultyIdAndCategory(Long facultyId, String category);
    List<FacultyDocument> findByVerified(Boolean verified);
}