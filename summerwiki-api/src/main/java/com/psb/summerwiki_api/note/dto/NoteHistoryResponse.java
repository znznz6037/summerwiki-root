package com.psb.summerwiki_api.note.dto;

import java.time.LocalDateTime;

import com.psb.summerwiki_api.note.entity.NoteHistory;

import lombok.Getter;

@Getter
public class NoteHistoryResponse {
    private final Long historyId;
    private final String title;
    private final LocalDateTime modifiedDate;

    public NoteHistoryResponse(NoteHistory history) {
        this.historyId = history.getId();
        this.title = history.getTitle();
        this.modifiedDate = history.getCreatedDate();
    }
}
