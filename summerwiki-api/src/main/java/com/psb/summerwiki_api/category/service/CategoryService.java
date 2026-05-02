package com.psb.summerwiki_api.category.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.psb.summerwiki_api.category.dto.CategoryRequest;
import com.psb.summerwiki_api.category.dto.CategoryResponse;
import com.psb.summerwiki_api.category.entity.Category;
import com.psb.summerwiki_api.category.repository.CategoryRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public Long create(CategoryRequest request) {
        Category parent = null;
        Long parentId = request.getParentId();
        
        if(parentId != null) {
            parent = categoryRepository.findById(parentId)
                    .orElseThrow(() -> new IllegalArgumentException("부모 카테고리를 찾을 수 없습니다."));
        }

        Category category = new Category(request.getName(), parent);
        return categoryRepository.save(category).getId();
    }

    public List<CategoryResponse> getCategories() {
        List<Category> categories = categoryRepository.findAllHierarchy();
        if (categories == null || categories.isEmpty()) {
            throw new IllegalArgumentException("루트 카테고리를 찾을 수 없습니다.");
        }

        return categories.stream()
                .map(CategoryResponse::new)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        categoryRepository.findById(id)
                .ifPresentOrElse(categoryRepository::delete, () -> {
                    throw new IllegalArgumentException("카테고리를 찾을 수 없습니다.");
                });
    }

    public void updateName(Long id, String newName) {
        categoryRepository.findById(id)
        .ifPresentOrElse(c -> c.updateName(newName), () -> {
            throw new IllegalArgumentException("카테고리를 찾을 수 없습니다.");
        });
    }

    public void updateParent(Long id, long parentId) {
        Category parent = categoryRepository.findById(parentId)
                .orElseThrow(() -> new IllegalArgumentException("부모 카테고리를 찾을 수 없습니다."));

        categoryRepository.findById(id)
        .ifPresentOrElse(c -> c.updateParent(parent), () -> {
            throw new IllegalArgumentException("카테고리를 찾을 수 없습니다.");
        });
    }
}
