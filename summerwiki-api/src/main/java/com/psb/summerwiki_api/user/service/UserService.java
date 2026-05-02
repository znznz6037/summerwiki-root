package com.psb.summerwiki_api.user.service;

import org.springframework.stereotype.Service;

import com.psb.summerwiki_api.user.dto.UserResponse;
import com.psb.summerwiki_api.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
        
    public UserResponse getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .map(user -> new UserResponse(user.getEmail(), user.getPicture(), user.getName(), user.getRole().name()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
