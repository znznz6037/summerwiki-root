package com.psb.summerwiki_api.note.dto;

import java.time.LocalDateTime;

import com.psb.summerwiki_api.note.entity.Note;

import lombok.Getter;

@Getter
public class NoteResponse {
    private final Long id;
    private final String title;
    private final String content;
    private final Long viewCount;
    private final Long categoryId;
    private final String categoryName;
    private final LocalDateTime lastModifiedDate;
    private final String createdBy;
    private final String lastModifiedBy;

    public NoteResponse(Note note) {
        this.id = note.getId();
        this.title = note.getTitle();
        this.content = note.getContent();
        this.viewCount = note.getViewCount();
        this.categoryId = note.getCategory().getId();
        this.categoryName = note.getCategory().getName();
        this.lastModifiedDate = note.getLastModifiedDate();
        this.createdBy = note.getCreatedBy();
        this.lastModifiedBy = note.getLastModifiedBy();
    }
}
