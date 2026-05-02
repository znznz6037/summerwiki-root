package com.psb.summerwiki_api.config.auth.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor
@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // 토큰 추출
        String token = resolveToken(request);

        log.debug("DEBUG: Request URL: " + request.getRequestURI());
        log.debug("DEBUG: Extracted Token: " + token);

        // 토큰 유효성 검사
        try {
            if (token != null && tokenProvider.validateToken(token)) {
                String email = tokenProvider.getEmail(token);
                String role = tokenProvider.getRole(token);

                List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(role));
                
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(email, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("====== [AUTH SUCCESS]: " + email + " with ROLE_USER");
            }
        } catch (ExpiredJwtException e) { //토큰 만료 시 401 Unauthorized 응답
            log.warn("WARN: JWT Token has expired - " + e.getMessage());

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Token has expired\"}");
            return; // 더 이상 필터 체인 진행 X
        } catch (Exception e) {
            log.error("ERROR: JWT Authentication failed - " + e.getMessage());
        }
        
        if (token != null && tokenProvider.validateToken(token)) {
            String email = tokenProvider.getEmail(token);
            String role = tokenProvider.getRole(token);

            List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(role));
            
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(email, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println("====== [AUTH SUCCESS]: " + email + " with ROLE_USER");
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}