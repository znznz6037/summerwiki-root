package com.psb.summerwiki_api.note.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.psb.summerwiki_api.note.entity.NoteHistory;

public interface NoteHistoryRepository extends JpaRepository<NoteHistory, Long> {
    List<NoteHistory> findAllByNoteIdOrderByCreatedDateDesc(Long noteId);
}