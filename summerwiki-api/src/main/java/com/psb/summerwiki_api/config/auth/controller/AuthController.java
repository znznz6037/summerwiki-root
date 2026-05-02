package com.psb.summerwiki_api.config.auth.controller;

import java.util.Collections;
import java.util.Map;

import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.psb.summerwiki_api.config.auth.service.AuthService;
import com.psb.summerwiki_api.global.common.ApiResponse;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;

    @PostMapping("/refresh")
    public ApiResponse<Map<String, String>> refresh(@CookieValue(name = "refreshToken") String refreshToken) {
        String newAccessToken = authService.refreshAccessToken(refreshToken);
        return ApiResponse.success(Collections.singletonMap("accessToken", newAccessToken));
    }
    
    @PostMapping("/logout")
    public ApiResponse<Void> logout(@CookieValue(name = "refreshToken") String refreshToken, HttpServletResponse response) {
        authService.logout(refreshToken, response);
        return ApiResponse.success(null);
    }
}
