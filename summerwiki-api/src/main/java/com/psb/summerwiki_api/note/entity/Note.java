package com.psb.summerwiki_api.note.entity;

import java.util.ArrayList;
import java.util.List;

import com.psb.summerwiki_api.category.entity.Category;
import com.psb.summerwiki_api.global.entity.BaseTimeEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;
import lombok.Builder;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Note extends BaseTimeEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    //@Lob
    //Hibernate 6 버전에서는 @Lob 어노테이션이 붙어 있으면, 내부적으로 해당 필드를 CLOB(Character Large Object) 타입으로 강제 매핑합니다. 심지어 뒤에 columnDefinition = "TEXT"를 적어주어도, JPA가 @Lob을 발견하면 CLOB으로 해석하려는 성향이 매우 강합니다. LOWER()와 같은 함수는 TEXT에는 적용되지만, CLOB에는 적용할 수 없기 때문에 발생하는 에러입니다.
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private Long viewCount = 0L;

    @OneToMany(mappedBy = "note", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<NoteHistory> noteHistories = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Builder
    public Note(String title, String content, Category category) {
        this.title = title;
        this.content = content;
        this.category = category;
    }

    public Note update(String title, String content, Category category) {
        if (title != null && !title.isEmpty()) {
            this.title = title;
        }
        if (content != null && !content.isEmpty()) {
            this.content = content;
        }
        if (category != null) {
            this.category = category;
        }

        return this;
    }
}
