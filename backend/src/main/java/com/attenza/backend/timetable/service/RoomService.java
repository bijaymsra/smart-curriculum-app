package com.attenza.backend.timetable.service;

import com.attenza.backend.entity.Department;
import com.attenza.backend.entity.Institution;
import com.attenza.backend.exception.BadRequestException;
import com.attenza.backend.repository.admin.InstitutionRepository;
import com.attenza.backend.repository.faculty.DepartmentRepository;
import com.attenza.backend.timetable.dto.RoomCreateRequest;
import com.attenza.backend.timetable.entity.Room;
import com.attenza.backend.timetable.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final InstitutionRepository institutionRepository;
    private final DepartmentRepository departmentRepository;

    public Room create(RoomCreateRequest request) {

        Institution institution = institutionRepository.findById(request.getInstitutionId())
            .orElseThrow(() -> new BadRequestException("Institution not found"));

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new BadRequestException("Department not found"));
        }

        roomRepository
            .findByInstitutionIdAndRoomCode(
                request.getInstitutionId(),
                request.getRoomCode()
            )
            .ifPresent(r -> {
                throw new BadRequestException("Room already exists");
            });

        Room room = new Room();
        room.setInstitution(institution);
        room.setDepartment(department);
        room.setRoomCode(request.getRoomCode());
        room.setRoomName(request.getRoomName());
        room.setCapacity(request.getCapacity());
        room.setRoomType(request.getRoomType());

        return roomRepository.save(room);
    }
}
