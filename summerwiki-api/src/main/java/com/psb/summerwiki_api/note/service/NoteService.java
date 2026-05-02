package com.psb.summerwiki_api.note.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.psb.summerwiki_api.category.entity.Category;
import com.psb.summerwiki_api.category.repository.CategoryRepository;
import com.psb.summerwiki_api.note.dto.NoteHistoryResponse;
import com.psb.summerwiki_api.note.dto.NoteRequest;
import com.psb.summerwiki_api.note.dto.NoteResponse;
import com.psb.summerwiki_api.note.entity.Note;
import com.psb.summerwiki_api.note.entity.NoteHistory;
import com.psb.summerwiki_api.note.repository.NoteHistoryRepository;
import com.psb.summerwiki_api.note.repository.NoteRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class NoteService {

    private final NoteRepository noteRepository;
    private final NoteHistoryRepository noteHistoryRepository;
    private final CategoryRepository categoryRepository;

    public long create(NoteRequest noteRequest) {
        Category category = categoryRepository.findById(noteRequest.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid category ID"));

        Note note = Note.builder()
                .title(noteRequest.getTitle())
                .content(noteRequest.getContent())
                .category(category)
                .build();

        NoteHistory history = NoteHistory.builder()
                .note(note)
                .title(note.getTitle())
                .content(note.getContent())
                .build();
        noteHistoryRepository.save(history);

        return noteRepository.save(note).getId();
    }

    @ReadOnlyProperty
    public NoteResponse getNote(Long noteId) {
        noteRepository.updateViewCount(noteId);

        Note note = noteRepository.findByIdWithCategory(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found"));

        return new NoteResponse(note);
    }

    @ReadOnlyProperty
    public List<NoteResponse> getNotes(Pageable pageable) {
        Page<Note> notePage = noteRepository.findAll(pageable);
        
        return notePage.getContent()
                .stream()
                .map(NoteResponse::new)
                .collect(Collectors.toList());
    }

    @ReadOnlyProperty
    public List<NoteHistoryResponse> getNoteHistories(Long noteId) {
        noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found"));
        
        return noteHistoryRepository.findAllByNoteIdOrderByCreatedDateDesc(noteId).stream()
                .map(NoteHistoryResponse::new)
                .collect(Collectors.toList());
    }

    public NoteResponse updateNote(Long noteId, NoteRequest noteRequest) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found"));

        NoteHistory history = NoteHistory.builder()
                .note(note)
                .title(noteRequest.getTitle())
                .content(noteRequest.getContent())
                .build();
        noteHistoryRepository.save(history);

        Category category = categoryRepository.findById(noteRequest.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid category ID"));

        note.update(noteRequest.getTitle(), noteRequest.getContent(), category);
        noteRepository.flush();
        return new NoteResponse(note);
    }

    public void deleteNote(Long noteId) {
        noteRepository.findById(noteId)
                .ifPresentOrElse(note -> {
                    noteRepository.delete(note);
                }, () -> {
                    throw new IllegalArgumentException("Note not found");
                });
    }

    public NoteHistoryResponse getNoteHistoryDetail(Long historyId) {
        NoteHistory history = noteHistoryRepository.findById(historyId)
                .orElseThrow(() -> new IllegalArgumentException("Note history not found"));

        return new NoteHistoryResponse(history);
    }
}
