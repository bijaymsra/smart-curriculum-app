package com.attenza.backend.timetable.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomCreateRequest {

    private Long institutionId;
    private Long departmentId; // nullable

    private String roomCode;
    private String roomName;
    private Integer capacity;
    private String roomType; // CLASSROOM, LAB, etc.
}
