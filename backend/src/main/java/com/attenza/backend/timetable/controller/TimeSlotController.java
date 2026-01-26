package com.attenza.backend.timetable.controller;

import com.attenza.backend.timetable.entity.TimeSlot;
import com.attenza.backend.timetable.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/timetable/time-slots")
@RequiredArgsConstructor
public class TimeSlotController {

    private final TimeSlotRepository timeSlotRepository;

    @GetMapping
    public List<TimeSlot> getAll() {
        return timeSlotRepository.findAll();
    }
}
