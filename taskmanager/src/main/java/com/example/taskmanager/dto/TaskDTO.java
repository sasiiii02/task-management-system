package com.example.taskmanager.dto;

import com.example.taskmanager.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Date;

@Data
public class TaskDTO {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Status is required")
    private Task.TaskStatus status;

    @NotNull(message = "Priority is required")
    private Task.TaskPriority priority;

    private Date dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
    private String username; // safe to expose, no password

    // Convert Task entity → TaskDTO (no user password exposed)
    public static TaskDTO fromEntity(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setDueDate(task.getDueDate());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        dto.setUserId(task.getUser().getId());
        dto.setUsername(task.getUser().getUsername());
        return dto;
    }
}