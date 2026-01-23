package com.attenza.backend.controller.student;

import com.attenza.backend.dto.student.StudentLoginRequest;
import com.attenza.backend.dto.student.StudentLoginResponse;
import com.attenza.backend.service.student.StudentAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/auth")
@RequiredArgsConstructor
public class StudentAuthController {

    private final StudentAuthService authService;

    @PostMapping("/login")
    public StudentLoginResponse login(
            @Valid @RequestBody StudentLoginRequest request  // Add @Valid
    ) {
        return authService.login(request);
    }

    @PostMapping("/logout/{studentId}")
    public void logout(@PathVariable Long studentId) {
        authService.logout(studentId);
    }
}