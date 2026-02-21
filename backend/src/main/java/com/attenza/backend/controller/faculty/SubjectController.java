package com.attenza.backend.controller.faculty;

import com.attenza.backend.entity.Subject;
import com.attenza.backend.service.faculty.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    // ---------------- GET ----------------

    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects(
            @RequestParam Long institutionId) {

        List<Subject> subjects = subjectService.getAllSubjects(institutionId);
        return ResponseEntity.ok(subjects);
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Subject>> getSubjectsByDepartment(
            @PathVariable Long departmentId) {

        List<Subject> subjects = subjectService.getSubjectsByDepartment(departmentId);
        return ResponseEntity.ok(subjects);
    }

    // ---------------- CREATE ----------------

    @PostMapping
    public ResponseEntity<Subject> createSubject(
            @RequestParam String subjectCode,
            @RequestParam String subjectName,
            @RequestParam(required = false) String description,
            @RequestParam Integer credits,
            @RequestParam Integer semester,
            @RequestParam Long departmentId) {

        Subject subject = subjectService.createSubject(
                subjectCode,
                subjectName,
                description,
                credits,
                semester,
                departmentId
        );

        return ResponseEntity.ok(subject);
    }

    // ---------------- DELETE ----------------

    @DeleteMapping("/{subjectId}")
    public ResponseEntity<Void> deleteSubject(
            @PathVariable Long subjectId) {

        subjectService.deleteSubject(subjectId);
        return ResponseEntity.ok().build();
    }


    // ---------------- STATS (Dashboard) ----------------

    @GetMapping("/stats")
    public ResponseEntity<?> getCourseStats(
            @RequestParam Long institutionId
    ) {

        long totalCourses = subjectService.getTotalCourses(institutionId);

        return ResponseEntity.ok(
                java.util.Map.of(
                        "totalCourses", totalCourses,
                        "activeClassrooms", 0 
                )
        );
    }
}
