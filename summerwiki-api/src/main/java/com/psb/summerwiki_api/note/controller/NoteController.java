package com.psb.summerwiki_api.note.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.psb.summerwiki_api.global.common.ApiResponse;
import com.psb.summerwiki_api.note.dto.NoteHistoryResponse;
import com.psb.summerwiki_api.note.dto.NoteRequest;
import com.psb.summerwiki_api.note.dto.NoteResponse;
import com.psb.summerwiki_api.note.repository.NoteRepository;
import com.psb.summerwiki_api.note.service.NoteService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {
    
    private final NoteService noteService;
    private final NoteRepository noteRepository;

    @PostMapping
    public ApiResponse<Long> createNote(@RequestBody NoteRequest noteRequest) {
        Long noteId = noteService.create(noteRequest);
        return ApiResponse.success(noteId);
    }

    @GetMapping()
    public ApiResponse<List<NoteResponse>> getNotes(@PageableDefault(size = 10, sort = "lastModifiedDate", direction = Sort.Direction.DESC) Pageable pageable) {
        List<NoteResponse> notes = noteService.getNotes(pageable);
        return ApiResponse.success(notes);
    }

    @GetMapping("/search")
    public ApiResponse<List<NoteResponse>> searchNotes(@RequestParam("q") String keyword) {
        return ApiResponse.success(noteRepository.findByKeyword(keyword)
            .stream()
            .map(NoteResponse::new)
            .toList());
    }
    
    @GetMapping("/{id}")
    public ApiResponse<NoteResponse> getNote(@PathVariable("id") Long id) {
        return ApiResponse.success(noteService.getNote(id));
    }

    @GetMapping("/{id}/history")
    public ApiResponse<List<NoteHistoryResponse>> getNoteHistory(@PathVariable("id") Long id) {
        return ApiResponse.success(noteService.getNoteHistories(id));
    }

    @PatchMapping("/{id}/view")
    public ApiResponse<Void> incrementViewCount(@PathVariable("id") Long id) {
        noteService.incrementViewCount(id);
        return ApiResponse.success(null);
    }
    
    @PutMapping("/{id}")
    public ApiResponse<NoteResponse> update(@PathVariable("id") Long id, @RequestBody NoteRequest noteRequest) {
        return ApiResponse.success(noteService.updateNote(id, noteRequest));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable("id") Long id) {
        noteService.deleteNote(id);
        return ApiResponse.success(null);
    }

    @GetMapping("/histories/{historyId}")
    public ApiResponse<NoteHistoryResponse> getNoteHistoryDetail(@PathVariable("historyId") Long historyId) {
        return ApiResponse.success(noteService.getNoteHistoryDetail(historyId));
    }
}
