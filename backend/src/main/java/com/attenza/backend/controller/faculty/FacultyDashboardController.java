package com.attenza.backend.controller.faculty;

import com.attenza.backend.dto.faculty.FacultyDashboardResponse;
import com.attenza.backend.service.faculty.FacultyDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.attenza.backend.dto.faculty.FacultyInsightDTO;
import java.util.List;

@RestController
@RequestMapping("/api/faculty/dashboard")
@RequiredArgsConstructor
public class FacultyDashboardController {

    private final FacultyDashboardService facultyDashboardService;

    @GetMapping
    public FacultyDashboardResponse getDashboard(
            @RequestAttribute("facultyId") String facultyId
    ) {
        return facultyDashboardService.getDashboard(facultyId);
    }

    @GetMapping("/insights")
    public List<FacultyInsightDTO> getInsights(
            @RequestAttribute("facultyId") String facultyId
    ) {
        return facultyDashboardService.generateInsights(facultyId);
    }


}


