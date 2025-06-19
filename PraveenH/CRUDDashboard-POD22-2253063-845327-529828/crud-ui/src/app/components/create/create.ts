import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Api } from '../../services/api';
import { Data } from '../../models/data';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule, 
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './create.html',
  styleUrl: './create.scss'
})
export class Create {
  dataForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private apiService: Api,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.dataForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      status: ['active', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.dataForm.valid) {
      this.isSubmitting = true;

      const newData: Data = {
        id: 0, // The backend will assign the actual ID
        ...this.dataForm.value,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.apiService.createData(newData).subscribe({
        next: (createdData) => {
          this.snackBar.open('Item created successfully!', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/list']);
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error creating item:', error);
          this.snackBar.open('Failed to create item. Please try again.', 'Close', {
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
