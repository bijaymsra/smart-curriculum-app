package com.attenza.backend.student.tasks.controller;

import com.attenza.backend.student.tasks.dto.*;
import com.attenza.backend.student.tasks.service.StudentTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/tasks")
@RequiredArgsConstructor
public class StudentTaskController {

    private final StudentTaskService service;

    /* =========================
       GET ALL TASKS + STATS
       ========================= */
    @GetMapping
    public ResponseEntity<StudentTaskListResponse> getTasks(
            Authentication authentication
    ) {
        Long studentId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(
                service.getTasksWithStats(studentId)
        );
    }

    /* =========================
       CREATE TASK
       ========================= */
    @PostMapping
    public ResponseEntity<StudentTaskResponse> createTask(
            Authentication authentication,
            @RequestBody CreateTaskRequest request
    ) {
        Long studentId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(
                service.createTask(studentId, request)
        );
    }

    /* =========================
       TOGGLE COMPLETE
       ========================= */
    @PostMapping("/{id}/complete")
    public ResponseEntity<Void> toggleComplete(
            Authentication authentication,
            @PathVariable Long id
    ) {
        Long studentId = Long.parseLong(authentication.getName());
        service.toggleComplete(studentId, id);
        return ResponseEntity.ok().build();
    }

    /* =========================
       DELETE TASK
       ========================= */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            Authentication authentication,
            @PathVariable Long id
    ) {
        Long studentId = Long.parseLong(authentication.getName());
        service.deleteTask(studentId, id);
        return ResponseEntity.ok().build();
    }
}
