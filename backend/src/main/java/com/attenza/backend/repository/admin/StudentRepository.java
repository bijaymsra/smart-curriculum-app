package com.attenza.backend.repository.admin;

import com.attenza.backend.entity.Student;
import com.attenza.backend.entity.StudentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findByInstitution_Id(Long institutionId);

    long countByInstitution_Id(Long institutionId);

    long countByInstitution_IdAndStatus(Long institutionId, StudentStatus status);

    Optional<Student> findByRegistrationNoAndInstitution_Id(String registrationNo, Long institutionId);
    
    // ADD THESE METHODS FOR DASHBOARD STATS:
    
    /**
     * Get average attendance percentage for all students in an institution
     */
    @Query("SELECT AVG(s.attendancePercentage) FROM Student s WHERE s.institution.id = :institutionId")
    Double findAverageAttendanceByInstitutionId(@Param("institutionId") Long institutionId);
    
    /**
     * Count students with attendance below a threshold (for warning stats)
     */
    @Query("SELECT COUNT(s) FROM Student s WHERE s.institution.id = :institutionId AND s.attendancePercentage < :threshold")
    Long countLowAttendanceStudents(@Param("institutionId") Long institutionId, @Param("threshold") Integer threshold);
    
    /**
     * Search students by name or registration number
     */
    @Query("SELECT s FROM Student s WHERE s.institution.id = :institutionId AND " +
           "(LOWER(s.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.registrationNo) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Student> searchByInstitutionAndKeyword(@Param("institutionId") Long institutionId, 
                                                @Param("query") String query);


       // 🔹 REQUIRED FOR ATTENDANCE QR FLOW
       Optional<Student> findByPublicId(String publicId);

       // 🔹 REQUIRED FOR STUDENT GROUP DYNAMIC COUNT
       // long countByInstitution_IdAndCourseAndBatchAndSemesterAndSectionAndDepartment(
       // Long institutionId,
       // String course,
       // String batch,
       // Integer semester,
       // String section,
       // String department
       // );
       long countByInstitution_IdAndCourseAndBatchAndSemesterAndSectionAndDepartmentAndStatusIn(
       Long institutionId,
       String course,
       String batch,
       Integer semester,
       String section,
       String department,
       java.util.Collection<com.attenza.backend.entity.StudentStatus> statuses
       );




}