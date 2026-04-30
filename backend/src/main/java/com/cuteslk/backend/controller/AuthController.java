package com.cuteslk.backend.controller;

import com.cuteslk.backend.config.JwtUtils;
import com.cuteslk.backend.dto.LoginRequest;
import com.cuteslk.backend.dto.UserDto;
import com.cuteslk.backend.model.User;
import com.cuteslk.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthController(UserService userService,
                          AuthenticationManager authenticationManager,
                          JwtUtils jwtUtils) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@Validated @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(request.getUsername());

        User user = userService.findByUsername(request.getUsername()).orElseThrow();
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("role", user.getRole());
        response.put("active", user.isActive());
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Validated @RequestBody UserDto dto) {
        if (userService.findByUsername(dto.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }

        String password = dto.getPassword() != null && !dto.getPassword().isBlank() ? dto.getPassword() : "password123";
        User newUser = new User(dto.getUsername(), password, dto.getRole().toUpperCase(), dto.isActive());
        newUser = userService.save(newUser);
        return ResponseEntity.ok(new UserDto(newUser.getId(), newUser.getUsername(), newUser.getRole(), newUser.isActive()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public List<UserDto> getUsers() {
        return userService.listAll().stream()
                .map(user -> new UserDto(user.getId(), user.getUsername(), user.getRole(), user.isActive()))
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/users/update")
    public ResponseEntity<?> updateUser(@Validated @RequestBody UserDto dto) {
        if (dto.getId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User id is required"));
        }

        User user = userService.findById(dto.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }

        if (dto.getUsername() != null && !dto.getUsername().isBlank()) {
            Long userId = user.getId();
            if (userService.findByUsername(dto.getUsername())
                    .filter(existing -> !existing.getId().equals(userId))
                    .isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
            }
            user.setUsername(dto.getUsername().trim());
        }

        if (dto.getRole() != null && !dto.getRole().isBlank()) {
            user.setRole(dto.getRole().toUpperCase());
        }
        user.setActive(dto.isActive());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(dto.getPassword());
        }

        user = userService.save(user);
        return ResponseEntity.ok(new UserDto(user.getId(), user.getUsername(), user.getRole(), user.isActive()));
    }
}
