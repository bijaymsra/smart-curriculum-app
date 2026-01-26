package com.attenza.backend.timetable.service;

import com.attenza.backend.exception.BadRequestException;
import com.attenza.backend.timetable.dto.TimeSlotCreateRequest;
import com.attenza.backend.timetable.entity.TimeSlot;
import com.attenza.backend.timetable.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;

    public TimeSlot create(TimeSlotCreateRequest request) {

        if (request.getStartTime().compareTo(request.getEndTime()) >= 0) {
            throw new BadRequestException("Start time must be before end time");
        }

        timeSlotRepository
            .findByDayOfWeekAndStartTimeAndEndTime(
                request.getDayOfWeek(),
                request.getStartTime(),
                request.getEndTime()
            )
            .ifPresent(ts -> {
                throw new BadRequestException("Time slot already exists");
            });

        TimeSlot slot = new TimeSlot();
        slot.setDayOfWeek(request.getDayOfWeek());
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());

        return timeSlotRepository.save(slot);
    }
}
