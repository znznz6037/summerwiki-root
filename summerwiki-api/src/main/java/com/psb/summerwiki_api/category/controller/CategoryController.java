package com.psb.summerwiki_api.category.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.psb.summerwiki_api.category.dto.CategoryRequest;
import com.psb.summerwiki_api.category.dto.CategoryResponse;
import com.psb.summerwiki_api.category.service.CategoryService;
import com.psb.summerwiki_api.global.common.ApiResponse;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/categories")   
@RequiredArgsConstructor
public class CategoryController {
    
    private final CategoryService categoryService;

    @PostMapping
    public ApiResponse<Long> create(@RequestBody CategoryRequest request) {
        return ApiResponse.success(categoryService.create(request));
    }

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getCategories() {
        return ApiResponse.success(categoryService.getCategories());
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Long> delete(@PathVariable("id") long id) {
        categoryService.delete(id);
        return ApiResponse.success(id);
    }

    @PatchMapping("/{id}/name")
    public ApiResponse<String> changeName(@PathVariable long id, @RequestBody CategoryRequest request) {
        categoryService.updateName(id, request.getName());
        return ApiResponse.success(request.getName());
    }

    @PatchMapping("/{id}/parent")
    public ApiResponse<Long> changeParent(@PathVariable long id, @RequestBody CategoryRequest request) {
        categoryService.updateParent(id, request.getParentId());
        return ApiResponse.success(request.getParentId());
    }
}
