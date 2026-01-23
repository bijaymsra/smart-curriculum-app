package com.attenza.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "faculty_documents")
@Getter
@Setter
public class FacultyDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    @Column(name = "document_name", nullable = false)
    private String documentName;

    @Column(name = "document_type")
    private String documentType; // PDF, JPG, DOC, etc.

    @Column(name = "document_category")
    private String category; // QUALIFICATION, IDENTITY, EMPLOYMENT, RESEARCH, OTHER

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "file_size")
    private Long fileSize; // in bytes

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @Column(name = "verified")
    private Boolean verified = false;

    @Column(name = "verified_by")
    private String verifiedByAdminId; // Admin publicId

    @Column(name = "verification_date")
    private LocalDateTime verificationDate;

    @PrePersist
    protected void onCreate() {
        this.uploadedAt = LocalDateTime.now();
    }
}