package com.attenza.backend.timetable.repository;

import com.attenza.backend.timetable.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoomRepository
        extends JpaRepository<Room, Long> {

    Optional<Room> findByInstitutionIdAndRoomCode(
            Long institutionId,
            String roomCode
    );
}
