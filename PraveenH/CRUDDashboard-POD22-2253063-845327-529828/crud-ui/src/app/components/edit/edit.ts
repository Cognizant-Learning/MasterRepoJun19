import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Api } from '../../services/api';
import { Data } from '../../models/data';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule, 
    MatCardModule, 
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './edit.html',
  styleUrl: './edit.scss'
})
export class Edit implements OnInit {
  dataForm: FormGroup;
  isLoading = true;
  isSubmitting = false;
  id: number = 0;

  constructor(
    private fb: FormBuilder,
    private apiService: Api,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.dataForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Get ID from route parameters
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.loadItemData(this.id);
    });
  }

  loadItemData(id: number): void {
    this.isLoading = true;
    this.apiService.getData(id).subscribe({
      next: (data: Data) => {
        this.dataForm.patchValue({
          name: data.name,
          description: data.description,
          status: data.status
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching item:', error);
        this.snackBar.open('Error loading item. Redirecting back to list.', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/list']);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.dataForm.valid) {
      this.isSubmitting = true;

      const updatedData: Data = {
        id: this.id,
        ...this.dataForm.value,
        updatedAt: new Date()
      };

      this.apiService.updateData(this.id, updatedData).subscribe({
        next: () => {
          this.snackBar.open('Item updated successfully!', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/list']);
        },
        error: (error) => {
          console.error('Error updating item:', error);
          this.snackBar.open('Failed to update item. Please try again.', 'Close', {
            duration: 3000
          });
          this.isSubmitting = false;
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.dataForm.controls).forEach(key => {
        this.dataForm.get(key)?.markAsTouched();
      });
    }
  }
}
