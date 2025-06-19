import { Component, OnInit } from '@angular/core';
import { ActivityLogService } from '../../services/activity-log.service';
import { ActivityLog } from '../../models/activity-log.model';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {
  activityLogs: ActivityLog[] = [];
  isLoading = true;
  
  constructor(private activityLogService: ActivityLogService) { }
  
  ngOnInit(): void {
    this.loadActivityLogs();
  }
  
  loadActivityLogs(): void {
    this.isLoading = true;
    this.activityLogService.getActivityLogs().subscribe(
      (logs) => {
        this.activityLogs = logs;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching activity logs', error);
        this.isLoading = false;
      }
    );
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
}
