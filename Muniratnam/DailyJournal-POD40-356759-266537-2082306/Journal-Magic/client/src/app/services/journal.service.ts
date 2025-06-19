import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JournalEntry, MoodData, MoodAnalysis } from '../models/user.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  
  constructor(private http: HttpClient) { }

  // Journal entry methods
  getJournalEntries(startDate?: Date, endDate?: Date): Observable<JournalEntry[]> {
    let url = `${environment.apiUrl}/journal`;
    const params: any = {};
    
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    
    return this.http.get<JournalEntry[]>(url, { params });
  }

  getJournalEntryById(id: string): Observable<JournalEntry> {
    return this.http.get<JournalEntry>(`${environment.apiUrl}/journal/${id}`);
  }

  createJournalEntry(entry: Partial<JournalEntry>): Observable<JournalEntry> {
    return this.http.post<JournalEntry>(`${environment.apiUrl}/journal`, entry);
  }

  updateJournalEntry(id: string, entry: Partial<JournalEntry>): Observable<JournalEntry> {
    return this.http.put<JournalEntry>(`${environment.apiUrl}/journal/${id}`, entry);
  }

  deleteJournalEntry(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/journal/${id}`);
  }

  // Mood analysis methods
  getMoodData(startDate?: Date, endDate?: Date): Observable<MoodData[]> {
    let url = `${environment.apiUrl}/mood`;
    const params: any = {};
    
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    
    return this.http.get<MoodData[]>(url, { params });
  }

  getMoodAnalysis(timeframe: 'week' | 'month' | 'year'): Observable<MoodAnalysis> {
    return this.http.get<MoodAnalysis>(`${environment.apiUrl}/mood/analysis`, {
      params: { timeframe }
    });
  }

  getActivityCorrelations(): Observable<MoodAnalysis['commonActivities']> {
    return this.http.get<MoodAnalysis['commonActivities']>(
      `${environment.apiUrl}/mood/activity-correlations`
    );
  }

  // Export functionality
  exportJournalData(format: 'pdf' | 'json' | 'csv'): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/journal/export`, {
      params: { format },
      responseType: 'blob'
    });
  }
}
