package com.example.taskmanager.controller;

import com.example.taskmanager.dto.TaskDTO;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@Valid @RequestBody TaskDTO taskDTO,
                                              @AuthenticationPrincipal UserDetails userDetails) {
        Task task = taskService.createTask(taskDTO, userDetails.getUsername());
        return ResponseEntity.ok(TaskDTO.fromEntity(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id,
                                              @Valid @RequestBody TaskDTO taskDTO,
                                              @AuthenticationPrincipal UserDetails userDetails) {
        Task task = taskService.updateTask(id, taskDTO, userDetails.getUsername());
        return ResponseEntity.ok(TaskDTO.fromEntity(task));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        taskService.deleteTask(id, userDetails.getUsername());
        return ResponseEntity.ok("Task deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTask(@PathVariable Long id,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        Task task = taskService.getTaskById(id, userDetails.getUsername());
        return ResponseEntity.ok(TaskDTO.fromEntity(task));
    }

    @GetMapping
    public ResponseEntity<Page<TaskDTO>> getTasks(
            @RequestParam(required = false) Task.TaskStatus status,
            @RequestParam(required = false) Task.TaskPriority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @AuthenticationPrincipal UserDetails userDetails) {

        String role = userDetails.getAuthorities().iterator().next()
                .getAuthority().replace("ROLE_", "");

        Page<Task> tasks = taskService.getTasks(
                userDetails.getUsername(), role, status, priority, page, size, sortBy, sortDir
        );

        // Convert every Task in the page to a TaskDTO
        return ResponseEntity.ok(tasks.map(TaskDTO::fromEntity));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<TaskDTO> markAsCompleted(@PathVariable Long id,
                                                   @AuthenticationPrincipal UserDetails userDetails) {
        Task task = taskService.markTaskAsCompleted(id, userDetails.getUsername());
        return ResponseEntity.ok(TaskDTO.fromEntity(task));
    }
}