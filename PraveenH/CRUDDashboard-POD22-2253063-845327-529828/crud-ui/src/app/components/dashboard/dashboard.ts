import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Api } from '../../services/api';
import { Data } from '../../models/data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  totalItems = 0;
  activeItems = 0;
  inactiveItems = 0;
  recentItems: Data[] = [];
  isLoading = true;

  constructor(private apiService: Api) {}

  ngOnInit(): void {
    this.apiService.getAllData().subscribe({
      next: (data: Data[]) => {
        this.totalItems = data.length;
        this.activeItems = data.filter(item => item.status === 'active').length;
        this.inactiveItems = data.filter(item => item.status === 'inactive').length;
        this.recentItems = data.slice(0, 5); // Get 5 most recent items
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
        this.isLoading = false;
      }
    });
  }
}
