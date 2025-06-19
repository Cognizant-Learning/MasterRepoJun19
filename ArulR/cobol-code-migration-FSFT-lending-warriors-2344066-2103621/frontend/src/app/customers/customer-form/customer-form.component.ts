import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../shared/services/customer/customer.service';
import { Customer } from '../../shared/models/customer/customer.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  customerForm!: FormGroup;
  isLoading = false;
  error = '';
  customerId?: number;
  isEditMode = false;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    
    // Check if we're in edit mode
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.customerId = Number(idParam);
      this.isEditMode = true;
      this.loadCustomer();
    }
  }

  initializeForm(): void {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\(\)\s]{8,20}$/)]],
      dateOfBirth: [null],
      status: ['ACTIVE', Validators.required],
      customerId: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{6,10}$/)]],
      address: this.fb.group({
        street: ['', [Validators.required, Validators.maxLength(100)]],
        city: ['', [Validators.required, Validators.maxLength(50)]],
        state: ['', [Validators.required, Validators.maxLength(50)]],
        zipCode: ['', [Validators.required, Validators.pattern(/^[0-9A-Z\-\s]{5,10}$/)]],
        country: ['', [Validators.required, Validators.maxLength(50)]]
      })
    });
  }

  loadCustomer(): void {
    if (!this.customerId) return;

    this.isLoading = true;
    this.customerService.getCustomerById(this.customerId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (customer) => {
          this.customerForm.patchValue({
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phoneNumber: customer.phoneNumber,
            dateOfBirth: customer.dateOfBirth,
            status: customer.status,
            customerId: customer.customerId,
            address: {
              street: customer.address.street,
              city: customer.address.city,
              state: customer.address.state,
              zipCode: customer.address.zipCode,
              country: customer.address.country
            }
          });
          
          // Disable customerId field in edit mode
          this.customerForm.get('customerId')?.disable();
        },
        error: () => {
          this.error = 'Failed to load customer details';
          this.snackBar.open('Error loading customer details', 'Close', { duration: 3000 });
        }
      });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formValue = this.customerForm.getRawValue();
    
    // Prepare customer data
    const customer: Customer = {
      id: this.customerId || 0,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      dateOfBirth: formValue.dateOfBirth,
      status: formValue.status,
      customerId: formValue.customerId,
      address: {
        street: formValue.address.street,
        city: formValue.address.city,
        state: formValue.address.state,
        zipCode: formValue.address.zipCode,
        country: formValue.address.country
      }
    };
    
    if (this.isEditMode) {
      this.updateCustomer(customer);
    } else {
      this.createCustomer(customer);
    }
  }

  createCustomer(customer: Customer): void {
    this.customerService.createCustomer(customer)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (createdCustomer) => {
          this.snackBar.open('Customer created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard/customers', createdCustomer.id]);
        },
        error: () => {
          this.error = 'Failed to create customer';
          this.snackBar.open('Error creating customer', 'Close', { duration: 3000 });
        }
      });
  }

  updateCustomer(customer: Customer): void {
    if (!this.customerId) return;
    
    this.customerService.updateCustomer(this.customerId, customer)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.snackBar.open('Customer updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard/customers', this.customerId]);
        },
        error: () => {
          this.error = 'Failed to update customer';
          this.snackBar.open('Error updating customer', 'Close', { duration: 3000 });
        }
      });
  }

  cancel(): void {
    if (this.isEditMode && this.customerId) {
      this.router.navigate(['/dashboard/customers', this.customerId]);
    } else {
      this.router.navigate(['/dashboard/customers']);
    }
  }
}
