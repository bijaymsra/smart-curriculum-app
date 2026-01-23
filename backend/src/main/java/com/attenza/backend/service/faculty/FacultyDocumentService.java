package com.attenza.backend.service.faculty;

import com.attenza.backend.dto.faculty.DocumentResponse;
import com.attenza.backend.entity.Faculty;
import com.attenza.backend.entity.FacultyDocument;
import com.attenza.backend.exception.BadRequestException;
import com.attenza.backend.repository.faculty.FacultyDocumentRepository;
import com.attenza.backend.repository.faculty.FacultyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacultyDocumentService {
    
    private final FacultyDocumentRepository documentRepository;
    private final FacultyRepository facultyRepository;
    
    public List<DocumentResponse> getFacultyDocuments(String facultyPublicId) {
        List<FacultyDocument> documents = documentRepository.findByFacultyPublicId(facultyPublicId);
        return documents.stream()
                .map(this::convertToDocumentResponse)
                .collect(Collectors.toList());
    }
    
    public FacultyDocument uploadDocument(String facultyPublicId, String documentName,
                                          String documentType, String category,
                                          String filePath, Long fileSize) {
        
        Faculty faculty = facultyRepository.findByPublicId(facultyPublicId)
                .orElseThrow(() -> new BadRequestException("Faculty not found"));
        
        FacultyDocument document = new FacultyDocument();
        document.setFaculty(faculty);
        document.setDocumentName(documentName);
        document.setDocumentType(documentType);
        document.setCategory(category);
        document.setFilePath(filePath);
        document.setFileSize(fileSize);
        document.setVerified(false);
        
        return documentRepository.save(document);
    }
    
    @Transactional
    public void verifyDocument(Long documentId, String adminPublicId) {
        FacultyDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new BadRequestException("Document not found"));
        
        document.setVerified(true);
        document.setVerifiedByAdminId(adminPublicId);
        document.setVerificationDate(java.time.LocalDateTime.now());
        
        documentRepository.save(document);
    }
    
    public void deleteDocument(Long documentId) {
        if (!documentRepository.existsById(documentId)) {
            throw new BadRequestException("Document not found");
        }
        documentRepository.deleteById(documentId);
    }
    
    private DocumentResponse convertToDocumentResponse(FacultyDocument document) {
        DocumentResponse response = new DocumentResponse();
        response.setId(document.getId());
        response.setDocumentName(document.getDocumentName());
        response.setDocumentType(document.getDocumentType());
        response.setCategory(document.getCategory());
        response.setFileSize(document.getFileSize());
        response.setUploadedAt(document.getUploadedAt());
        response.setVerified(document.getVerified());
        response.setVerifiedByAdminId(document.getVerifiedByAdminId());
        response.setVerificationDate(document.getVerificationDate());
        return response;
    }
}