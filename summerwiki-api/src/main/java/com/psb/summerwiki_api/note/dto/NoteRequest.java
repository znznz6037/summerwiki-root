package com.psb.summerwiki_api.note.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NoteRequest {
    private String title;
    private String content;
    private Long categoryId;
}
