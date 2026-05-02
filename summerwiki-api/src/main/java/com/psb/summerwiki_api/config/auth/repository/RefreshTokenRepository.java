package com.psb.summerwiki_api.config.auth.repository;

import java.util.Optional;

import org.springframework.data.repository.*;

import com.psb.summerwiki_api.config.auth.entity.RefreshToken;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
    Optional<RefreshToken> findByRefreshToken(String refreshToken);
}
