import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { JournalService } from '../../services/journal.service';
import { JournalEntry } from '../../models/user.models';

@Component({
  selector: 'app-journal-entry',
  templateUrl: './journal-entry.component.html',
  styleUrls: ['./journal-entry.component.scss']
})
export class JournalEntryComponent implements OnInit {
  journalForm: FormGroup;
  loading = false;
  submitted = false;
  isEditMode = false;
  entryId: string | null = null;
  error = '';
  savingSuccess = false;

  // Emoji options for the mood selector
  moodEmojis = [
    { emoji: '😀', name: 'Happy', value: 5 },
    { emoji: '😊', name: 'Content', value: 4 },
    { emoji: '😐', name: 'Neutral', value: 3 },
    { emoji: '😔', name: 'Sad', value: 2 },
    { emoji: '😢', name: 'Very Sad', value: 1 },
    { emoji: '😡', name: 'Angry', value: 1 },
    { emoji: '😰', name: 'Anxious', value: 2 },
    { emoji: '😴', name: 'Tired', value: 2 },
    { emoji: '🤩', name: 'Excited', value: 5 },
    { emoji: '😌', name: 'Relaxed', value: 4 }
  ];

  selectedEmoji = this.moodEmojis[2]; // Default to Neutral

  constructor(
    private formBuilder: FormBuilder,
    private journalService: JournalService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.journalForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', [Validators.required]],
      moodRating: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      moodEmoji: ['😐', Validators.required],
      activities: ['', Validators.maxLength(200)],
      tags: ['', Validators.maxLength(100)]
    });

    // Check if we're editing an existing entry
    this.route.params.subscribe(params => {
      this.entryId = params['id'];
      if (this.entryId) {
        this.isEditMode = true;
        this.loadJournalEntry(this.entryId);
      }
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.journalForm.controls; }

  loadJournalEntry(id: string): void {
    this.loading = true;
    this.journalService.getJournalEntryById(id).subscribe(
      entry => {
        this.journalForm.patchValue({
          title: entry.title,
          content: entry.content,
          moodRating: entry.moodRating,
          moodEmoji: entry.moodEmoji,
          activities: entry.activities.join(', '),
          tags: entry.tags.join(', ')
        });
        
        // Set selected emoji
        this.selectedEmoji = this.moodEmojis.find(e => e.emoji === entry.moodEmoji) || this.moodEmojis[2];
        this.loading = false;
      },
      error => {
        console.error('Error loading journal entry', error);
        this.error = 'Unable to load journal entry. Please try again.';
        this.loading = false;
      }
    );
  }

  selectEmoji(emoji: any): void {
    this.selectedEmoji = emoji;
    this.journalForm.patchValue({
      moodEmoji: emoji.emoji,
      moodRating: emoji.value
    });
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.journalForm.invalid) {
      return;
    }

    this.loading = true;
    this.savingSuccess = false;
    
    // Format the activities and tags as arrays
    const formValues = this.journalForm.value;
    const entry = {
      ...formValues,
      activities: formValues.activities ? formValues.activities.split(',').map((item: string) => item.trim()) : [],
      tags: formValues.tags ? formValues.tags.split(',').map((item: string) => item.trim()) : []
    };

    const request = this.isEditMode ? 
      this.journalService.updateJournalEntry(this.entryId!, entry) :
      this.journalService.createJournalEntry(entry);

    request.subscribe(
      result => {
        this.loading = false;
        this.savingSuccess = true;
        
        // Navigate back to journal list after short delay
        setTimeout(() => {
          this.router.navigate(['/journal']);
        }, 1500);
      },
      error => {
        this.error = error.error?.message || 'Failed to save journal entry. Please try again.';
        this.loading = false;
      }
    );
  }
}
