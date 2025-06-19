package com.dailyjournal.web.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents a daily journal entry with mood tracking and optional attachment.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JournalEntry {
    /**
     * Unique identifier for the journal entry.
     */
    private Long id;

    /**
     * Date of the journal entry.
     */
    private LocalDateTime date;

    /**
     * The main text content of the journal entry.
     */
    private String entryText;

    /**
     * The mood or emotion selected by the user (e.g., Happy, Sad).
     */
    private String mood;

    /**
     * Intensity of the mood, typically on a scale (e.g., 1-5).
     */
    private int moodIntensity;

    /**
     * Optional tags for categorizing the entry (e.g., Work, Family).
     */
    private List<String> tags;

    /**
     * Path or URL to an optional image or file attachment.
     */
    private String attachmentPath;
}