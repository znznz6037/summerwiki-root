package com.psb.summerwiki_api.config.auth.service;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.psb.summerwiki_api.config.auth.entity.RefreshToken;
import com.psb.summerwiki_api.config.auth.jwt.JwtTokenProvider;
import com.psb.summerwiki_api.config.auth.repository.RefreshTokenRepository;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public String refreshAccessToken(String refreshToken) {
        //RefreshToken 로테이션 로직 추가 검토

        if (refreshToken == null || !tokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        refreshTokenRepository.findByRefreshToken(refreshToken)
            .orElseThrow(() -> new IllegalArgumentException("Refresh token not found in repository"));

        //새로운 AccessToken 생성
        return tokenProvider.createAccessToken(tokenProvider.getEmail(refreshToken), tokenProvider.getRole(refreshToken));
    }

    @Transactional
    public void logout(String refreshToken, HttpServletResponse response) {
        refreshTokenRepository.findByRefreshToken(refreshToken)
            .ifPresent(token -> refreshTokenRepository.delete(token));
        
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
            .httpOnly(true)
            .secure(false) // 운영에선 true
            .path("/")
            .maxAge(0) // 즉시 만료
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
