package com.psb.summerwiki_api.category.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.psb.summerwiki_api.category.entity.Category;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CategoryResponse {
    private Long id;
    private String name;
    private List<CategoryResponse> children = new ArrayList<>();

    public CategoryResponse(Category entity) {
        this.id = entity.getId();
        this.name = entity.getName();
        this.children = entity.getChildren().stream()
                .map(CategoryResponse::new)
                .collect(Collectors.toList());
    }
}
