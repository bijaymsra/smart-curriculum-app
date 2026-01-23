package com.attenza.backend.controller.admin;

import com.attenza.backend.dto.student.StudentResponse;
import com.attenza.backend.dto.student.UpdateStudentStatusRequest;
import com.attenza.backend.dto.student.StudentStatsResponse;
import com.attenza.backend.entity.Student;
import com.attenza.backend.service.admin.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/students")
@RequiredArgsConstructor
public class AdminStudentController {

    private final StudentService studentService;

    @GetMapping
    public List<StudentResponse> getStudents(@RequestParam Long adminId) {
        return studentService.getStudentsForAdmin(adminId);
    }

    @GetMapping("/stats")
    public StudentStatsResponse getStats(@RequestParam Long adminId) {
        return studentService.getStats(adminId);
    }

    @GetMapping("/dashboard-stats")
    public StudentStatsResponse getDashboardStudentStats(
            @RequestParam Long institutionId) {
        return studentService.getStudentStats(institutionId);
    }

    @PostMapping
    public StudentResponse createStudent(
            @RequestBody Student student,
            @RequestParam Long adminId
    ) {
        return studentService.createStudent(student, adminId);
    }


    // adding student id for accesing individual student 
    @GetMapping("/{studentId}")
    public StudentResponse getStudentById(
            @PathVariable Long studentId,
            @RequestParam Long adminId
    ) {
        return studentService.getStudentById(studentId, adminId);
    }

    @PatchMapping("/{studentId}/status")
    public StudentResponse updateStudentStatus(
            @PathVariable Long studentId,
            @RequestParam Long adminId,
            @RequestBody UpdateStudentStatusRequest request
    ) {
        return studentService.updateStudentStatus(studentId, adminId, request);
    }





}
