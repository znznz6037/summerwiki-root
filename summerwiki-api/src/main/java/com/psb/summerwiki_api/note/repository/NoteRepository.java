package com.psb.summerwiki_api.note.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.psb.summerwiki_api.note.entity.Note;

public interface NoteRepository extends JpaRepository<Note, Long> {
    @Query("select n from Note n join fetch n.category where n.id = :id")
    Optional<Note> findByIdWithCategory(@Param("id") Long id);

    @Modifying
    @Query("update Note n set n.viewCount = n.viewCount + 1 where n.id = :id")
    void updateViewCount(@Param("id") Long id);

    //@Query("SELECT n FROM Note n WHERE LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           //"OR LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    @Query("SELECT n FROM Note n JOIN FETCH n.category " +
       "WHERE LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
       "OR LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Note> findByKeyword(@Param("keyword") String keyword);
}
