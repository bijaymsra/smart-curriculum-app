package com.attenza.backend.student.tasks.service;

import com.attenza.backend.student.tasks.dto.*;
import com.attenza.backend.student.tasks.entity.StudentTask;
import com.attenza.backend.student.tasks.repository.StudentTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentTaskService {

    private final StudentTaskRepository repository;

    /* =========================================
       GET TASKS + STATS (MAIN METHOD)
       ========================================= */
    public StudentTaskListResponse getTasksWithStats(Long studentId) {

        List<StudentTask> tasks =
                repository.findByStudentIdOrderByDueDateAsc(studentId);

        long total = tasks.size();
        long completed = tasks.stream()
                .filter(t -> Boolean.TRUE.equals(t.getCompleted()))
                .count();

        long pending = tasks.stream()
                .filter(t -> !Boolean.TRUE.equals(t.getCompleted()))
                .count();

        long overdue = tasks.stream()
                .filter(t ->
                        !Boolean.TRUE.equals(t.getCompleted())
                                && t.getDueDate() != null
                                && t.getDueDate().isBefore(LocalDate.now())
                )
                .count();

        int completionRate = total == 0
                ? 0
                : (int) ((completed * 100) / total);

        int pointsEarned = tasks.stream()
                .filter(t -> Boolean.TRUE.equals(t.getCompleted()))
                .mapToInt(t -> t.getPoints() == null ? 0 : t.getPoints())
                .sum();

        List<StudentTaskResponse> taskDTOs = tasks.stream()
                .map(task -> StudentTaskResponse.builder()
                        .id(task.getId())
                        .title(task.getTitle())
                        .description(task.getDescription())
                        .dueDate(task.getDueDate())
                        .dueTime(task.getDueTime())
                        .priority(task.getPriority())
                        .category(task.getCategory())
                        .estimatedTime(task.getEstimatedTime())
                        .points(task.getPoints())
                        .completed(task.getCompleted())
                        .completedAt(task.getCompletedAt())
                        .createdAt(task.getCreatedAt())
                        .overdue(
                                !Boolean.TRUE.equals(task.getCompleted())
                                        && task.getDueDate() != null
                                        && task.getDueDate().isBefore(LocalDate.now())
                        )
                        .build())
                .toList();

        return StudentTaskListResponse.builder()
                .tasks(taskDTOs)
                .stats(
                        StudentTaskStatsDTO.builder()
                                .total(total)
                                .completed(completed)
                                .pending(pending)
                                .overdue(overdue)
                                .completionRate(completionRate)
                                .pointsEarned(pointsEarned)
                                .streak(0) // upgrade later
                                .build()
                )
                .build();
    }

    /* =========================================
       CREATE TASK
       ========================================= */
    public StudentTaskResponse createTask(Long studentId, CreateTaskRequest req) {

        StudentTask task = StudentTask.builder()
                .studentId(studentId)
                .title(req.getTitle())
                .description(req.getDescription())
                .dueDate(req.getDueDate())
                .priority(req.getPriority())
                .category(req.getCategory())
                .estimatedTime(req.getEstimatedTime())
                .points(10)
                .completed(false)
                .build();

        StudentTask saved = repository.save(task);

        return StudentTaskResponse.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .description(saved.getDescription())
                .dueDate(saved.getDueDate())
                .priority(saved.getPriority())
                .category(saved.getCategory())
                .estimatedTime(saved.getEstimatedTime())
                .points(saved.getPoints())
                .completed(saved.getCompleted())
                .createdAt(saved.getCreatedAt())
                .overdue(false)
                .build();
    }

    /* =========================================
       TOGGLE COMPLETE
       ========================================= */
    public void toggleComplete(Long studentId, Long taskId) {

        StudentTask task = repository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getStudentId().equals(studentId)) {
            throw new RuntimeException("Unauthorized");
        }

        boolean newStatus = !Boolean.TRUE.equals(task.getCompleted());

        task.setCompleted(newStatus);
        task.setCompletedAt(newStatus ? LocalDateTime.now() : null);

        repository.save(task);
    }

    /* =========================================
       DELETE TASK
       ========================================= */
    public void deleteTask(Long studentId, Long taskId) {

        StudentTask task = repository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getStudentId().equals(studentId)) {
            throw new RuntimeException("Unauthorized");
        }

        repository.delete(task);
    }
}
