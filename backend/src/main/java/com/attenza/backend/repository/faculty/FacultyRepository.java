package com.attenza.backend.repository.faculty;

import com.attenza.backend.entity.Faculty;
import com.attenza.backend.entity.enums.FacultyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    
    Optional<Faculty> findByPublicId(String publicId);
    
    Optional<Faculty> findByFacultyId(String facultyId);
    
    Optional<Faculty> findByEmail(String email);
    
    List<Faculty> findByInstitutionId(Long institutionId);
    
    Page<Faculty> findByInstitutionId(Long institutionId, Pageable pageable);
    
    List<Faculty> findByDepartmentId(Long departmentId);
    
    List<Faculty> findByStatus(FacultyStatus status);
    
    List<Faculty> findByInstitutionIdAndStatus(Long institutionId, FacultyStatus status);

    @Query("SELECT f FROM Faculty f WHERE f.institution.id = :institutionId AND f.utilizationPercentage >= :minUtilization")
    List<Faculty> findByInstitutionIdAndUtilizationPercentageGreaterThanEqual(@Param("institutionId") Long institutionId, 
                                                                            @Param("minUtilization") Integer minUtilization);

    @Query("SELECT f FROM Faculty f WHERE f.institution.id = :institutionId AND f.utilizationPercentage BETWEEN :minUtilization AND :maxUtilization")
    List<Faculty> findByInstitutionIdAndUtilizationPercentageBetween(@Param("institutionId") Long institutionId, 
                                                                    @Param("minUtilization") Integer minUtilization,
                                                                    @Param("maxUtilization") Integer maxUtilization);

    @Query("SELECT f FROM Faculty f WHERE f.institution.id = :institutionId AND f.utilizationPercentage < :maxUtilization")
    List<Faculty> findByInstitutionIdAndUtilizationPercentageLessThan(@Param("institutionId") Long institutionId, 
                                                                    @Param("maxUtilization") Integer maxUtilization);

    @Query("SELECT f FROM Faculty f WHERE f.institution.id = :institutionId " +
        "AND (:status IS NULL OR " +
        "  CASE :status " +
        "    WHEN 'ACTIVE' THEN f.status = com.attenza.backend.entity.enums.FacultyStatus.ACTIVE " +
        "    WHEN 'WARNING' THEN f.status = com.attenza.backend.entity.enums.FacultyStatus.WARNING " +
        "    WHEN 'SUSPENDED' THEN f.status = com.attenza.backend.entity.enums.FacultyStatus.SUSPENDED " +
        "    WHEN 'ON_LEAVE' THEN f.status = com.attenza.backend.entity.enums.FacultyStatus.ON_LEAVE " +
        "    ELSE true " +
        "  END) " +
        "AND (:departmentId IS NULL OR f.department.id = :departmentId) " +
        "AND (:minUtilization IS NULL OR f.utilizationPercentage >= :minUtilization) " +
        "AND (:maxUtilization IS NULL OR f.utilizationPercentage <= :maxUtilization)")
    List<Faculty> findByInstitutionIdAndFilters(@Param("institutionId") Long institutionId,
                                            @Param("status") String status,
                                            @Param("departmentId") Long departmentId,
                                            @Param("minUtilization") Integer minUtilization,
                                            @Param("maxUtilization") Integer maxUtilization);


    
    @Query("SELECT f FROM Faculty f WHERE f.institution.id = :institutionId AND " +
           "(LOWER(f.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.facultyId) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Faculty> searchByInstitutionAndKeyword(@Param("institutionId") Long institutionId,
                                                @Param("searchTerm") String searchTerm);
    
    @Query("SELECT COUNT(f) FROM Faculty f WHERE f.institution.id = :institutionId")
    Long countByInstitutionId(@Param("institutionId") Long institutionId);
    
    @Query("SELECT COUNT(f) FROM Faculty f WHERE f.institution.id = :institutionId AND f.status = 'ACTIVE'")
    Long countActiveByInstitutionId(@Param("institutionId") Long institutionId);
    
    @Query("SELECT AVG(f.utilizationPercentage) FROM Faculty f WHERE f.institution.id = :institutionId")
    Double findAverageUtilizationByInstitutionId(@Param("institutionId") Long institutionId);
    
    @Query("SELECT AVG(f.punctualityPercentage) FROM Faculty f WHERE f.institution.id = :institutionId")
    Double findAveragePunctualityByInstitutionId(@Param("institutionId") Long institutionId);
    
    boolean existsByFacultyIdAndInstitutionId(String facultyId, Long institutionId);
    
    boolean existsByEmailAndInstitutionId(String email, Long institutionId);

    // Count faculty by institution and status
    @Query("SELECT COUNT(f) FROM Faculty f WHERE f.institution.id = :institutionId AND f.status = :status")
    Long countByInstitutionIdAndStatus(@Param("institutionId") Long institutionId, 
                                      @Param("status") FacultyStatus status);



    Optional<Faculty> findByFacultyIdAndInstitution_PublicId(String facultyId, String institutionPublicId);



}