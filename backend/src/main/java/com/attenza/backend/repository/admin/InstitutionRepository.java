package com.attenza.backend.repository.admin;

import com.attenza.backend.entity.Institution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InstitutionRepository extends JpaRepository<Institution, Long> {
    Optional<Institution> findByEmail(String email);
    Optional<Institution> findByPublicId(String publicId);
    boolean existsByEmail(String email);
}