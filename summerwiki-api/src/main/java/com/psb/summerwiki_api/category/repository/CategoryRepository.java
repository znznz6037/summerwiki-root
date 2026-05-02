package com.psb.summerwiki_api.category.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.psb.summerwiki_api.category.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("select distinct c from Category c " +
           "left join fetch c.children " +
           "where c.parent is null " +
           "order by c.id asc")
    List<Category> findAllHierarchy();
}
