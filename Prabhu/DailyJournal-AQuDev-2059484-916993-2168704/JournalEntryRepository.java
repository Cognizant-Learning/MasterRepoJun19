package com.dailyjournal.web.repository;

import com.dailyjournal.web.entity.JournalEntryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for {@link JournalEntryEntity}.
 * Provides CRUD operations and query methods for journal entries.
 */
@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntryEntity, Long> {
}