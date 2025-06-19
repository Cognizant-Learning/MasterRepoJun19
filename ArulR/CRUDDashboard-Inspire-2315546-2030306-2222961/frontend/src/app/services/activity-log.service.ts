import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityLog } from '../models/activity-log.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {
  private apiUrl = 'http://localhost:8080/api/activity-log';

  constructor(private http: HttpClient) { }

  getActivityLogs(): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(this.apiUrl);
  }
}
