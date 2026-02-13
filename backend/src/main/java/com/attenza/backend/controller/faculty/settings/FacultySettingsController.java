package com.attenza.backend.controller.faculty.settings;

import com.attenza.backend.dto.faculty.settings.FacultyProfileUpdateRequest;
import com.attenza.backend.dto.faculty.settings.FacultySettingsResponse;
import com.attenza.backend.service.faculty.settings.FacultySettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/faculty/settings")
@RequiredArgsConstructor
public class FacultySettingsController {

    private final FacultySettingsService facultySettingsService;

    /* =========================
       GET MY SETTINGS
       ========================= */
    @GetMapping("/me")
    public ResponseEntity<FacultySettingsResponse> getMySettings(
            Authentication authentication
    ) {

        String facultyId = authentication.getName();

        return ResponseEntity.ok(
                facultySettingsService.getMySettings(facultyId)
        );
    }

    /* =========================
       UPDATE MY PROFILE
       ========================= */
    @PutMapping("/me")
    public ResponseEntity<Void> updateMyProfile(
            Authentication authentication,
            @RequestBody FacultyProfileUpdateRequest request
    ) {

        String facultyId = authentication.getName();

        facultySettingsService.updateMyProfile(facultyId, request);

        return ResponseEntity.ok().build();
    }
}
