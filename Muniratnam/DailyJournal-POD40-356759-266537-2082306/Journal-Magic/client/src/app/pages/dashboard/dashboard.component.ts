import { Component, OnInit } from '@angular/core';
import { JournalService } from '../../services/journal.service';
import { AuthService } from '../../services/auth.service';
import { User, JournalEntry, MoodData } from '../../models/user.models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentEntries: JournalEntry[] = [];
  moodTimeframe: 'week' | 'month' | 'year' = 'week';
  loading = {
    entries: false,
    mood: false
  };
  error: string | null = null;

  constructor(
    private journalService: JournalService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.loadRecentEntries();
  }

  loadRecentEntries(): void {
    this.loading.entries = true;
    
    // Get entries from the last 7 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    this.journalService.getJournalEntries(startDate).subscribe(
      (entries) => {
        this.recentEntries = entries.slice(0, 5); // Get only the 5 most recent
        this.loading.entries = false;
      },
      (error) => {
        console.error('Error loading journal entries', error);
        this.error = 'Failed to load recent journal entries.';
        this.loading.entries = false;
      }
    );
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  createNewEntry(): void {
    // This will be handled by routing in the template
  }

  formatEntryDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  }

  getMoodEmoji(rating: number): string {
    if (rating >= 4.5) return '🤩';
    if (rating >= 3.5) return '😊';
    if (rating >= 2.5) return '😐';
    if (rating >= 1.5) return '😔';
    return '😢';
  }
}
