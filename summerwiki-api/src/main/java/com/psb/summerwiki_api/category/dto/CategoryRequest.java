package com.psb.summerwiki_api.category.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {
    private String name;
    private Long parentId;
}
