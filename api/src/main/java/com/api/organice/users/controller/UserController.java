package com.api.organice.users.controller;


import com.api.organice.auth.data.ForgotPasswordRequest;
import com.api.organice.config.ApplicationProperties;
import com.api.organice.users.data.CreateUserRequest;
import com.api.organice.users.data.UpdateUserPasswordRequest;
import com.api.organice.users.data.UserResponse;
import com.api.organice.users.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ApplicationProperties applicationProperties;

    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest request) {
        UserResponse user = userService.create(request);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/verify-email")
    public RedirectView verifyEmail(@RequestParam String token) {
        userService.verifyEmail(token);
        return new RedirectView(applicationProperties.getLoginPageUrl());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        userService.forgotPassword(req.getEmail());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(
            @Valid @RequestBody UpdateUserPasswordRequest requestDTO) {
        userService.resetPassword(requestDTO);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/password")
    public ResponseEntity<UserResponse> updatePassword(
            @Valid @RequestBody UpdateUserPasswordRequest requestDTO) {
        UserResponse user = userService.updatePassword(requestDTO);
        return ResponseEntity.ok(user);
    }

}
