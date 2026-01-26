package com.attenza.backend.timetable.controller;

import com.attenza.backend.timetable.entity.StudentGroup;
import com.attenza.backend.timetable.service.StudentGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/timetable/student-groups")
@RequiredArgsConstructor
public class StudentGroupController {

    private final StudentGroupService studentGroupService;

    @GetMapping
    public List<StudentGroup> getAll(
        @RequestParam Long institutionId
    ) {
        return studentGroupService.getAllByInstitution(institutionId);
    }
}
