package com.attenza.backend.timetable.controller;

import com.attenza.backend.timetable.entity.CourseOffering;
import com.attenza.backend.timetable.repository.CourseOfferingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/timetable/course-offerings")
@RequiredArgsConstructor
public class CourseOfferingController {

    private final CourseOfferingRepository courseOfferingRepository;

    @GetMapping
    public List<CourseOffering> getAll() {
        return courseOfferingRepository.findAll();
    }
}
