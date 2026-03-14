package com.example.taskmanager.repository;

import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {
    
    Page<Task> findByUser(User user, Pageable pageable);
    
    Page<Task> findByUserAndStatus(User user, Task.TaskStatus status, Pageable pageable);
    
    Page<Task> findByUserAndPriority(User user, Task.TaskPriority priority, Pageable pageable);
    
    @Query("SELECT t FROM Task t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority)")
    Page<Task> findAllWithFilters(@Param("status") Task.TaskStatus status, 
                                  @Param("priority") Task.TaskPriority priority, 
                                  Pageable pageable);
    
    Page<Task> findAll(Pageable pageable); // For ADMIN
}