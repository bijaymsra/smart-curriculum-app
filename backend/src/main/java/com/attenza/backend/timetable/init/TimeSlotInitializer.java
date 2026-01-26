package com.attenza.backend.timetable.init;

import com.attenza.backend.timetable.entity.TimeSlot;
import com.attenza.backend.timetable.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TimeSlotInitializer implements CommandLineRunner {

    private final TimeSlotRepository timeSlotRepository;

    @Override
    public void run(String... args) {

        // 🔒 Safety check: if MONDAY exists, assume all are seeded
        if (timeSlotRepository.existsByDayOfWeek(DayOfWeek.MONDAY)) {
            return;
        }

        List<LocalTime[]> slots = List.of(
            new LocalTime[]{ LocalTime.of(9, 0),  LocalTime.of(10, 0) },
            new LocalTime[]{ LocalTime.of(10, 0), LocalTime.of(11, 0) },
            new LocalTime[]{ LocalTime.of(11, 0), LocalTime.of(12, 0) },
            new LocalTime[]{ LocalTime.of(12, 0), LocalTime.of(13, 0) },
            new LocalTime[]{ LocalTime.of(13, 0), LocalTime.of(14, 0) },
            new LocalTime[]{ LocalTime.of(14, 0), LocalTime.of(15, 0) },
            new LocalTime[]{ LocalTime.of(15, 0), LocalTime.of(16, 0) },
            new LocalTime[]{ LocalTime.of(16, 0), LocalTime.of(17, 0) }
        );

        for (DayOfWeek day : List.of(
                DayOfWeek.MONDAY,
                DayOfWeek.TUESDAY,
                DayOfWeek.WEDNESDAY,
                DayOfWeek.THURSDAY,
                DayOfWeek.FRIDAY,
                DayOfWeek.SATURDAY
        )) {

            for (LocalTime[] slot : slots) {
                TimeSlot timeSlot = new TimeSlot();
                timeSlot.setDayOfWeek(day);
                timeSlot.setStartTime(slot[0]);
                timeSlot.setEndTime(slot[1]);

                timeSlotRepository.save(timeSlot);
            }
        }

        System.out.println("✅ Default TimeSlots seeded (MONDAY–SATURDAY)");
    }
}
