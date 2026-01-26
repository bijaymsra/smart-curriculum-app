package com.attenza.backend.timetable.controller;

import com.attenza.backend.timetable.dto.TimetableCreateRequest;
import com.attenza.backend.timetable.entity.TimetableEntry;
import com.attenza.backend.timetable.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.attenza.backend.timetable.dto.TimetableResponse;


import java.util.List;

@RestController
@RequestMapping("/api/admin/timetable/entries")
@RequiredArgsConstructor
public class TimetableController {

    private final TimetableService timetableService;

    /* =========================
       CREATE TIMETABLE ENTRY
       ========================= */
    @PostMapping
    public ResponseEntity<TimetableEntry> create(
            @RequestBody TimetableCreateRequest request
    ) {
        return ResponseEntity.ok(timetableService.create(request));
    }

    /* =========================
       GET ALL (ADMIN VIEW)
       ========================= */
    @GetMapping
    public ResponseEntity<List<TimetableEntry>> getAll() {
        return ResponseEntity.ok(timetableService.getAll());
    }

    /* =========================
       GET BY STUDENT GROUP
       ========================= */
    @GetMapping("/student-group/{studentGroupId}")
    public ResponseEntity<List<TimetableEntry>> getByStudentGroup(
            @PathVariable Long studentGroupId
    ) {
        return ResponseEntity.ok(
                timetableService.getByStudentGroup(studentGroupId)
        );
    }

    /* =========================
       GET BY FACULTY
       ========================= */
    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<TimetableEntry>> getByFaculty(
            @PathVariable Long facultyId
    ) {
        return ResponseEntity.ok(
                timetableService.getByFaculty(facultyId)
        );
    }

    /* =========================
       GET BY ROOM (OPTIONAL)
       ========================= */
    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<TimetableEntry>> getByRoom(
            @PathVariable Long roomId
    ) {
        return ResponseEntity.ok(
                timetableService.getByRoom(roomId)
        );
    }

    //  Delete entry
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        timetableService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // edit entry
    @PutMapping("/{id}")
    public ResponseEntity<TimetableEntry> update(
            @PathVariable Long id,
            @RequestBody TimetableCreateRequest request
    ) {
        return ResponseEntity.ok(timetableService.update(id, request));
    }

    @GetMapping("/ui")
    public List<TimetableResponse> getAllForUI() {
        return timetableService.getAllForUI();
    }


}
