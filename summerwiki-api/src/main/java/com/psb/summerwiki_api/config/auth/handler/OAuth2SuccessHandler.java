package com.psb.summerwiki_api.config.auth.handler;

import com.psb.summerwiki_api.config.auth.entity.RefreshToken;
import com.psb.summerwiki_api.config.auth.jwt.JwtTokenProvider;
import com.psb.summerwiki_api.config.auth.repository.RefreshTokenRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = (String) oAuth2User.getAttributes().get("email");
        
        String refreshToken = tokenProvider.createRefreshToken(email, "ROLE_USER");
        refreshTokenRepository.save(new RefreshToken(email, refreshToken));

        //RefreshToken을 HttpOnly 쿠키로 설정
        addRefreshTokenCookie(response, refreshToken);

        //AccessToken만 쿼리 파라미터로 전달
        String accessToken = tokenProvider.createAccessToken(email, "ROLE_USER");
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:8080/oauth2/redirect")
                .queryParam("token", accessToken)
                .build().toUriString();
        //String targetUrl = "운영URL/oauth2/redirect?token=" + token;

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private void addRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        // 쿠키 설정 (예: HttpOnly, Secure 등)
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false) // 운영 환경에서는 true로 설정
                .path("/")
                .maxAge(1800)
                .sameSite("Lax")
                .build();
        
        response.addHeader("Set-Cookie", cookie.toString());
    }
}