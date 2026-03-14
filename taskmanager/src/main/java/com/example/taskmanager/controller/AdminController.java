package com.example.taskmanager.controller;

import com.example.taskmanager.dto.TaskDTO;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")   // entire controller is ADMIN-only
public class AdminController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    // GET /api/admin/tasks — all tasks in the system with pagination + filters
    @GetMapping("/tasks")
    public ResponseEntity<Page<TaskDTO>> getAllTasks(
            @RequestParam(required = false) Task.TaskStatus status,
            @RequestParam(required = false) Task.TaskPriority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        // Reuse your existing TaskRepository query
        Page<Task> tasks = taskRepository.findAllWithFilters(status, priority, pageable);
        return ResponseEntity.ok(tasks.map(TaskDTO::fromEntity));
    }

    // GET /api/admin/users — all registered users (no passwords returned)
    @GetMapping("/users")
    public ResponseEntity<List<UserSummary>> getAllUsers() {
        List<UserSummary> users = userRepository.findAll()
                .stream()
                .map(u -> new UserSummary(u.getId(), u.getUsername(), u.getEmail(), u.getRole()))
                .toList();
        return ResponseEntity.ok(users);
    }

    // Simple record — no need for a separate DTO file for something this small
    public record UserSummary(Long id, String username, String email, String role) {}
}