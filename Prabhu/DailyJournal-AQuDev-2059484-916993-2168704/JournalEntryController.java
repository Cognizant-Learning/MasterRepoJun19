package com.dailyjournal.web.controller;

import com.dailyjournal.web.entity.JournalEntryEntity;
import com.dailyjournal.web.model.JournalEntry;
import com.dailyjournal.web.service.JournalEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing journal entries.
 */
@RestController
@RequestMapping("/api/journal-entries")
public class JournalEntryController {

    @Autowired
    private JournalEntryService service;

    /**
     * Creates a new journal entry.
     *
     * @param journalEntry the journal entry data to create
     * @return the created JournalEntryEntity wrapped in a ResponseEntity
     */
    @PostMapping
    public ResponseEntity<JournalEntryEntity> createJournalEntry(@RequestBody JournalEntry journalEntry) {
        JournalEntryEntity savedEntry = service.saveJournalEntry(journalEntry);
        return ResponseEntity.ok(savedEntry);
    }
}