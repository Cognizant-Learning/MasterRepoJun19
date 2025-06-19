import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../shared/services/customer/customer.service';
import { Customer } from '../../shared/models/customer/customer.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {
  customer: Customer | null = null;
  isLoading = false;
  error = '';
  customerId!: number;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCustomer();
  }

  loadCustomer(): void {
    if (!this.customerId) {
      this.error = 'Invalid customer ID';
      return;
    }

    this.isLoading = true;
    this.customerService.getCustomerById(this.customerId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (customer) => {
          this.customer = customer;
          this.error = '';
        },
        error: (err) => {
          this.error = 'Failed to load customer details';
          console.error(err);
        }
      });
  }

  editCustomer(): void {
    this.router.navigate(['/dashboard/customers', this.customerId, 'edit']);
  }

  deleteCustomer(): void {
    if (!this.customer) return;

    if (confirm(`Are you sure you want to delete customer ${this.customer.firstName} ${this.customer.lastName}?`)) {
      this.isLoading = true;
      this.customerService.deleteCustomer(this.customerId)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            this.snackBar.open('Customer deleted successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/dashboard/customers']);
          },
          error: () => {
            this.snackBar.open('Failed to delete customer', 'Close', { duration: 3000 });
          }
        });
    }
  }

  getStatusClass(): string {
    if (!this.customer) return '';
    
    switch(this.customer.status) {
      case 'ACTIVE': return 'status-active';
      case 'INACTIVE': return 'status-inactive';
      case 'SUSPENDED': return 'status-suspended';
      default: return '';
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/customers']);
  }
}
