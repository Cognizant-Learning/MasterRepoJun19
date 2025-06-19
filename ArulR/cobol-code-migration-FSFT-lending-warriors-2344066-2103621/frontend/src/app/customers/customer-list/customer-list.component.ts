import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, finalize, startWith, switchMap } from 'rxjs/operators';
import { of, merge } from 'rxjs';
import { CustomerService } from '../../shared/services/customer/customer.service';
import { Customer } from '../../shared/models/customer/customer.model';
import { CustomerPage } from '../../shared/models/customer/customer-page.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  displayedColumns: string[] = ['customerId', 'name', 'email', 'phoneNumber', 'status', 'actions'];
  dataSource = new MatTableDataSource<Customer>([]);
  resultsLength = 0;
  isLoading = true;
  error = '';
  filterValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    // Set up sorting and pagination
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),        switchMap(() => {
          this.isLoading = true;
          return this.customerService.getCustomers(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            `${this.sort.active},${this.sort.direction}`,
            this.filterValue          ).pipe(
            catchError(() => {
              this.error = 'Failed to fetch customers. Please try again later.';
              return of(null);
            })
          );
        }
        ),
        finalize(() => this.isLoading = false)
      )      .subscribe((data: CustomerPage | null) => {
        if (data) {
          this.error = '';
          this.dataSource.data = data.content;
          this.resultsLength = data.totalElements;
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue.trim().toLowerCase();
    this.paginator.pageIndex = 0;
    this.loadCustomers();
  }
  loadCustomers() {
    this.isLoading = true;
    this.customerService.getCustomers(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      `${this.sort.active},${this.sort.direction}`,
      this.filterValue
    ).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data: CustomerPage) => {
        this.dataSource.data = data.content;
        this.resultsLength = data.totalElements;
        this.error = '';
      },
      error: () => {
        this.error = 'Failed to fetch customers. Please try again later.';
      }
    });
  }

  viewCustomer(customerId: number) {
    this.router.navigate(['/dashboard/customers', customerId]);
  }

  editCustomer(customerId: number) {
    this.router.navigate(['/dashboard/customers', customerId, 'edit']);
  }

  deleteCustomer(customer: Customer) {
    if (confirm(`Are you sure you want to delete customer ${customer.firstName} ${customer.lastName}?`)) {
      this.customerService.deleteCustomer(customer.id).subscribe({
        next: () => {
          this.snackBar.open('Customer deleted successfully', 'Close', { duration: 3000 });
          this.loadCustomers();
        },
        error: () => {
          this.snackBar.open('Failed to delete customer', 'Close', { duration: 3000 });
        }
      });
    }
  }
  
  getFullName(customer: Customer): string {
    return `${customer.firstName} ${customer.lastName}`;
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'ACTIVE': return 'status-active';
      case 'INACTIVE': return 'status-inactive';
      case 'SUSPENDED': return 'status-suspended';
      default: return '';
    }
  }
}
