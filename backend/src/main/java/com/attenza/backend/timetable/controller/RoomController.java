package com.attenza.backend.timetable.controller;

import com.attenza.backend.timetable.entity.Room;
import com.attenza.backend.timetable.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/timetable/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomRepository roomRepository;

    @GetMapping
    public List<Room> getAll() {
        return roomRepository.findAll();
    }
}
