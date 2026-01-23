package com.attenza.backend.controller.faculty;

import com.attenza.backend.dto.faculty.FacultyLoginRequest;
import com.attenza.backend.dto.faculty.FacultyLoginResponse;
import com.attenza.backend.service.faculty.FacultyAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/faculty/auth")
@RequiredArgsConstructor
public class FacultyAuthController {

    private final FacultyAuthService authService;

    @PostMapping("/login")
    public FacultyLoginResponse login(
            @Valid @RequestBody FacultyLoginRequest request
    ) {
        return authService.login(request);
    }

    @PostMapping("/logout/{facultyId}")
    public void logout(@PathVariable Long facultyId) {
        authService.logout(facultyId);
    }
}
