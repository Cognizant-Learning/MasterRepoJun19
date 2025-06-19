import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { InventoryTableComponent } from './inventory-table/inventory-table';
import { ActivityLog } from './activity-log/activity-log';
import { DataVisualization } from './data-visualization/data-visualization';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, InventoryTableComponent, ActivityLog, DataVisualization],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {}
