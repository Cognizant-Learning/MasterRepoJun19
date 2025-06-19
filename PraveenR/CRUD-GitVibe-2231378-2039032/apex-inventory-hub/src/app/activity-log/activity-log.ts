import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-log',
  standalone: true,
  templateUrl: './activity-log.html',
  styleUrl: './activity-log.scss',
  imports: [MatCardModule, CommonModule]
})
export class ActivityLog {
  @Input() actions: string[] = [
    'Created item: Widget A',
    'Edited item: Widget B',
    'Deleted item: Widget C',
    'Low stock alert: Widget D',
    'Out of stock: Widget E'
  ];
}
