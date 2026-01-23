package com.attenza.backend.controller.admin;

import com.attenza.backend.dto.admin.InstitutionSignupRequest;
import com.attenza.backend.service.admin.InstitutionSignupService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/signup")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class InstitutionSignupController {

    private final InstitutionSignupService signupService;

    @PostMapping("/institution")
    public String register(@RequestBody InstitutionSignupRequest request) {
        signupService.registerInstitution(request);
        return "Institution registered successfully";
    }
}
