package com.dailyjournal.web.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * JPA entity representing a daily journal entry with mood tracking and optional attachment.
 */
@Entity
@Table(name = "journal_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JournalEntryEntity {
    /**
     * Unique identifier for the journal entry.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Date of the journal entry.
     */
    @Column(nullable = false)
    private LocalDateTime date;

    /**
     * The main text content of the journal entry.
     */
    @Column(name = "entry_text", columnDefinition = "TEXT")
    private String entryText;

    /**
     * The mood or emotion selected by the user (e.g., Happy, Sad).
     */
    @Column(length = 50)
    private String mood;

    /**
     * Intensity of the mood, typically on a scale (e.g., 1-5).
     */
    private int moodIntensity;

    /**
     * Optional tags for categorizing the entry (e.g., Work, Family).
     */
    @ElementCollection
    @CollectionTable(
        name = "journal_entry_tags",
        joinColumns = @JoinColumn(name = "journal_entry_id")
    )
    @Column(name = "tag")
    private List<String> tags;

    /**
     * Path or URL to an optional image or file attachment.
     */
    @Column(name = "attachment_path", length = 512)
    private String attachmentPath;
}