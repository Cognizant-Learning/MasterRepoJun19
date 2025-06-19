package com.dailyjournal.web.service;

import com.dailyjournal.web.entity.JournalEntryEntity;
import com.dailyjournal.web.model.JournalEntry;
import com.dailyjournal.web.repository.JournalEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service class for handling journal entry business logic.
 */
@Service
public class JournalEntryService {

    @Autowired
    private JournalEntryRepository repository;

    /**
     * Saves a new journal entry to the repository.
     *
     * @param journalEntry the journal entry model to save
     * @return the persisted JournalEntryEntity
     */
    public JournalEntryEntity saveJournalEntry(JournalEntry journalEntry) {
        JournalEntryEntity entity = new JournalEntryEntity(
            null,
            journalEntry.getDate(),
            journalEntry.getEntryText(),
            journalEntry.getMood(),
            journalEntry.getMoodIntensity(),
            journalEntry.getTags(),
            journalEntry.getAttachmentPath()
        );
        return repository.save(entity);
    }
}