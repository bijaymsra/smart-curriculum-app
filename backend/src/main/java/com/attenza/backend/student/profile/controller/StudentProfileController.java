package com.attenza.backend.student.profile.controller;

import com.attenza.backend.student.profile.dto.StudentProfileResponse;
import com.attenza.backend.student.profile.service.StudentProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/profile")
@RequiredArgsConstructor
public class StudentProfileController {

    private final StudentProfileService profileService;

    @GetMapping
    public ResponseEntity<StudentProfileResponse> getProfile(
            Authentication authentication
    ) {
        Long studentId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(profileService.getProfile(studentId));
    }
}
