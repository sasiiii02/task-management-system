package com.example.taskmanager.service;

import com.example.taskmanager.dto.TaskDTO;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.exception.ResourceNotFoundException;
import com.example.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskService {
    
    private final TaskRepository taskRepository;
    private final UserService userService;
    
    public Task createTask(TaskDTO taskDTO, String username) {
        User user = userService.findByUsername(username);
        
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setStatus(taskDTO.getStatus() != null ? taskDTO.getStatus() : Task.TaskStatus.TODO);
        task.setPriority(taskDTO.getPriority() != null ? taskDTO.getPriority() : Task.TaskPriority.MEDIUM);
        task.setDueDate(taskDTO.getDueDate());
        task.setUser(user);
        
        return taskRepository.save(task);
    }
    
    public Task updateTask(Long taskId, TaskDTO taskDTO, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        
        // Check if user has permission to update this task
        User user = userService.findByUsername(username);
        if (!task.getUser().getId().equals(user.getId()) && !user.getRole().equals("ADMIN")) {
            throw new AccessDeniedException("You don't have permission to update this task");
        }
        
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setStatus(taskDTO.getStatus());
        task.setPriority(taskDTO.getPriority());
        task.setDueDate(taskDTO.getDueDate());
        
        return taskRepository.save(task);
    }
    
    public void deleteTask(Long taskId, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        
        User user = userService.findByUsername(username);
        if (!task.getUser().getId().equals(user.getId()) && !user.getRole().equals("ADMIN")) {
            throw new AccessDeniedException("You don't have permission to delete this task");
        }
        
        taskRepository.delete(task);
    }
    
    public Task getTaskById(Long taskId, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        
        User user = userService.findByUsername(username);
        if (!task.getUser().getId().equals(user.getId()) && !user.getRole().equals("ADMIN")) {
            throw new AccessDeniedException("You don't have permission to view this task");
        }
        
        return task;
    }
    
    public Page<Task> getTasks(String username, String role, 
                               Task.TaskStatus status, 
                               Task.TaskPriority priority,
                               int page, int size, String sortBy, String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                    Sort.by(sortBy).descending() : 
                    Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        if (role.equals("ADMIN")) {
            // Admin can see all tasks with filters
            return taskRepository.findAllWithFilters(status, priority, pageable);
        } else {
            // Regular user can only see their own tasks
            User user = userService.findByUsername(username);
            if (status != null) {
                return taskRepository.findByUserAndStatus(user, status, pageable);
            } else if (priority != null) {
                return taskRepository.findByUserAndPriority(user, priority, pageable);
            } else {
                return taskRepository.findByUser(user, pageable);
            }
        }
    }
    
    public Task markTaskAsCompleted(Long taskId, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        
        User user = userService.findByUsername(username);
        if (!task.getUser().getId().equals(user.getId()) && !user.getRole().equals("ADMIN")) {
            throw new AccessDeniedException("You don't have permission to update this task");
        }
        
        task.setStatus(Task.TaskStatus.DONE);
        return taskRepository.save(task);
    }
}