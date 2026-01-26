package com.attenza.backend.timetable.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TimetableCreateRequest {

    private Long courseOfferingId;
    private Long timeSlotId;
    private Long roomId;
}
