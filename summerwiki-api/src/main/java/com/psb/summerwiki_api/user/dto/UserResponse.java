package com.psb.summerwiki_api.user.dto;

import lombok.Getter;
import lombok.AllArgsConstructor;

@Getter
@AllArgsConstructor
public class UserResponse {
    private String email;
    private String picture;
    private String name;
    private String role;
}
