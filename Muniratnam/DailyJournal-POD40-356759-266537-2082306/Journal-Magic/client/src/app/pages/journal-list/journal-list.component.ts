import { Component, OnInit } from '@angular/core';
import { JournalService } from '../../services/journal.service';
import { JournalEntry } from '../../models/user.models';

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.scss']
})
export class JournalListComponent implements OnInit {
  journalEntries: JournalEntry[] = [];
  filteredEntries: JournalEntry[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  moodFilter: number | null = null;
  selectedMonth: string | null = null;
  tagFilter: string | null = null;
  
  // Store unique tags for filtering
  availableTags: string[] = [];
  
  // For calendar view
  months: string[] = [
    'January', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August', 
    'September', 'October', 'November', 'December'
  ];
  
  currentDate = new Date();
  currentMonth = this.months[this.currentDate.getMonth()];
  currentYear = this.currentDate.getFullYear();
  
  constructor(private journalService: JournalService) { }

  ngOnInit(): void {
    this.loadJournalEntries();
  }

  loadJournalEntries(): void {
    this.loading = true;
    this.error = null;
    
    this.journalService.getJournalEntries().subscribe(
      (entries) => {
        this.journalEntries = entries;
        this.filteredEntries = [...entries];
        this.extractTags();
        this.loading = false;
      },
      (error) => {
        console.error('Error loading journal entries', error);
        this.error = 'Failed to load journal entries. Please try again later.';
        this.loading = false;
      }
    );
  }
  
  extractTags(): void {
    // Extract all unique tags from journal entries
    const allTags = this.journalEntries.flatMap(entry => entry.tags);
    this.availableTags = [...new Set(allTags)];
  }
  
  applyFilters(): void {
    this.filteredEntries = this.journalEntries.filter(entry => {
      // Apply search filter
      const searchMatch = this.searchTerm ? 
        entry.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        entry.content.toLowerCase().includes(this.searchTerm.toLowerCase()) :
        true;
      
      // Apply mood filter
      const moodMatch = this.moodFilter !== null ? 
        entry.moodRating === this.moodFilter : 
        true;
      
      // Apply month filter
      const entryDate = new Date(entry.createdAt);
      const entryMonth = this.months[entryDate.getMonth()];
      const monthMatch = this.selectedMonth ? 
        entryMonth === this.selectedMonth : 
        true;
      
      // Apply tag filter
      const tagMatch = this.tagFilter ? 
        entry.tags.includes(this.tagFilter) : 
        true;
      
      return searchMatch && moodMatch && monthMatch && tagMatch;
    });
  }
  
  clearFilters(): void {
    this.searchTerm = '';
    this.moodFilter = null;
    this.selectedMonth = null;
    this.tagFilter = null;
    this.filteredEntries = [...this.journalEntries];
  }
  
  setMoodFilter(rating: number | null): void {
    this.moodFilter = rating;
    this.applyFilters();
  }
  
  setMonthFilter(month: string | null): void {
    this.selectedMonth = month;
    this.applyFilters();
  }
  
  setTagFilter(tag: string | null): void {
    this.tagFilter = tag;
    this.applyFilters();
  }
  
  search(): void {
    this.applyFilters();
  }
  
  exportJournal(format: 'json' | 'csv' = 'json'): void {
    this.journalService.exportJournalData(format).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `journal-export-${new Date().toISOString().slice(0, 10)}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      (error) => {
        console.error('Error exporting journal data', error);
        this.error = `Failed to export journal data as ${format.toUpperCase()}`;
      }
    );
  }
  
  getMoodEmoji(rating: number): string {
    if (rating >= 4.5) return '🤩';
    if (rating >= 3.5) return '😊';
    if (rating >= 2.5) return '😐';
    if (rating >= 1.5) return '😔';
    return '😢';
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
