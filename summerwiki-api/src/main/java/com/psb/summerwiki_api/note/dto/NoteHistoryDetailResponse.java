package com.psb.summerwiki_api.note.dto;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class NoteHistoryDetailResponse {
    private Long historyId;
    private Long noteId;
    private String title;
    private String content;
    private LocalDateTime createdDate;

    public NoteHistoryDetailResponse(Long historyId, Long noteId, String title, String content, LocalDateTime createdDate) {
        this.historyId = historyId;
        this.noteId = noteId;
        this.title = title;
        this.content = content;
        this.createdDate = createdDate;
    }
}
