package com.example.taskmanager.controller;

import com.example.taskmanager.entity.User;
import com.example.taskmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        // Return safe fields only — never return the password
        return ResponseEntity.ok(Map.of(
            "id",       user.getId(),
            "username", user.getUsername(),
            "email",    user.getEmail(),
            "role",     user.getRole()
        ));
    }
}