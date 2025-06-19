import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Api } from '../../services/api';
import { Data } from '../../models/data';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatProgressSpinnerModule, 
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './view.html',
  styleUrl: './view.scss'
})
export class View implements OnInit {
  item: Data | null = null;
  isLoading = true;
  id: number = 0;

  constructor(
    private apiService: Api,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.loadItemData(this.id);
    });
  }

  loadItemData(id: number): void {
    this.isLoading = true;
    this.apiService.getData(id).subscribe({
      next: (data: Data) => {
        this.item = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching item:', error);
        this.snackBar.open('Error loading item. Redirecting back to list.', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/list']);
      }
    });
  }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.apiService.deleteData(id).subscribe({
        next: () => {
          this.snackBar.open('Item deleted successfully!', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/list']);
        },
        error: (error) => {
          console.error('Error deleting item:', error);
          this.snackBar.open('Failed to delete item. Please try again.', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }
}
