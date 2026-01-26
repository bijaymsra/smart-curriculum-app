package com.attenza.backend.timetable.repository;

import com.attenza.backend.timetable.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Optional;

public interface TimeSlotRepository
        extends JpaRepository<TimeSlot, Long> {

    Optional<TimeSlot> findByDayOfWeekAndStartTimeAndEndTime(
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            LocalTime endTime
    );

    boolean existsByDayOfWeek(DayOfWeek dayOfWeek);
}
