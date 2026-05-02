package com.psb.summerwiki_api.user.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.psb.summerwiki_api.global.common.ApiResponse;
import com.psb.summerwiki_api.user.dto.UserResponse;
import com.psb.summerwiki_api.user.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<UserResponse> getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = (String) principal;

        UserResponse userResponse = userService.getCurrentUser(email);
        if (userResponse == null) {
            return ApiResponse.error("User not found");
        }

        return ApiResponse.success(userResponse);
    }
    
}
