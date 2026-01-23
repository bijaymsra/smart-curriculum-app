package com.attenza.backend.service.faculty;

import com.attenza.backend.dto.faculty.FacultyLoginRequest;
import com.attenza.backend.dto.faculty.FacultyLoginResponse;

public interface FacultyAuthService {

    FacultyLoginResponse login(FacultyLoginRequest request);

    void logout(Long facultyId);
}
