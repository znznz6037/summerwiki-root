package com.psb.summerwiki_api.category.entity;

import java.util.ArrayList;
import java.util.List;

import com.psb.summerwiki_api.global.entity.BaseTimeEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Category extends BaseTimeEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Category> children = new ArrayList<>();

    public Category(String name, Category parent) {
        this.name = name;
        this.parent = parent;

        if(parent != null) {
            parent.getChildren().add(this);
        }
    }

    public void updateName(String newName) {
        if (newName == null || newName.isEmpty()) {
            throw new IllegalArgumentException("이름은 필수입니다.");
        }
        this.name = newName;
    }

    public void updateParent(Category parent) {
        if(parent != null && parent.getId().equals(this.id)) {
            throw new IllegalArgumentException("부모 카테고리를 자기 자신으로 설정할 수 없습니다.");
        }
        this.parent = parent;
    }
}
