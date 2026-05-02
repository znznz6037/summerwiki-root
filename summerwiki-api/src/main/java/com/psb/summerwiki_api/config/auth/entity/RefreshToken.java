package com.psb.summerwiki_api.config.auth.entity;

import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
@RedisHash(value = "refreshToken", timeToLive = 1800)
public class RefreshToken {
    
    @Id
    private String id;

    @Indexed
    private String refreshToken;
}
