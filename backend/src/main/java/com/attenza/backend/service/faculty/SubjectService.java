package com.attenza.backend.service.faculty;

import com.attenza.backend.entity.Department;
import com.attenza.backend.entity.Subject;
import com.attenza.backend.exception.BadRequestException;
import com.attenza.backend.repository.faculty.DepartmentRepository;
import com.attenza.backend.repository.faculty.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final DepartmentRepository departmentRepository;

    // ---------------- READ ----------------

    public List<Subject> getAllSubjects(Long institutionId) {
        return subjectRepository.findByDepartment_Institution_Id(institutionId);
    }

    public List<Subject> getSubjectsByDepartment(Long departmentId) {
        return subjectRepository.findByDepartment_Id(departmentId);
    }

    // to count courses
    public long getTotalCourses(Long institutionId) {
        return subjectRepository.countByDepartment_Institution_Id(institutionId);
    }




    // ---------------- CREATE ----------------

    public Subject createSubject(
            String subjectCode,
            String subjectName,
            String description,
            Integer credits,
            Integer semester,
            Long departmentId
    ) {

        // Subject code uniqueness check
        if (subjectRepository.findBySubjectCode(subjectCode).isPresent()) {
            throw new BadRequestException("Subject code already exists");
        }

        // Fetch REAL department (important!)
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new BadRequestException("Department not found"));

        // Create subject
        Subject subject = new Subject();
        subject.setSubjectCode(subjectCode);
        subject.setSubjectName(subjectName);
        subject.setDescription(description);
        subject.setCredits(credits);
        subject.setSemester(semester);
        subject.setDepartment(department);

        return subjectRepository.save(subject);
    }

    // ---------------- DELETE ----------------

    public void deleteSubject(Long subjectId) {

        if (!subjectRepository.existsById(subjectId)) {
            throw new BadRequestException("Subject not found");
        }

        subjectRepository.deleteById(subjectId);
    }

}
