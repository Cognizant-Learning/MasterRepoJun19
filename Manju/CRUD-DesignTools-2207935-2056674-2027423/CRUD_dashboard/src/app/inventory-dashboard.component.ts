import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';

interface InventoryItem {
  name: string;
  quantity: number;
  status: string;
}

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './inventory-dashboard.component.html',
  styleUrl: './inventory-dashboard.component.scss'
})
export class InventoryDashboardComponent implements OnInit {
  items: InventoryItem[] = [];
  newItem: InventoryItem = { name: '', quantity: 0, status: 'In Stock' };
  errorMsg = '';
  nameTouched = false;
  quantityTouched = false;
  editingIndex: number | null = null;
  editItem: InventoryItem = { name: '', quantity: 0, status: 'In Stock' };
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<InventoryItem[]>('http://localhost:3001/api/inventory').subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load inventory:', err);
        this.items = [];
        this.errorMsg = 'Failed to load inventory data.';
      }
    });
  }

  async showAlert(message: string) {
    alert(message);
  }

  addItem() {
    this.nameTouched = true;
    this.quantityTouched = true;
    this.errorMsg = '';
    if (!this.newItem.name && this.newItem.quantity < 1) {
      this.errorMsg = 'Name is required and quantity must be at least 1.';
      return;
    }
    if (!this.newItem.name) {
      this.errorMsg = 'Name is required.';
      return;
    }
    if (this.newItem.quantity < 1) {
      this.errorMsg = 'Quantity must be at least 1 to add stock.';
      return;
    }
    // Check for duplicate name (case-insensitive)
    if (this.items.some(item => item.name.trim().toLowerCase() === this.newItem.name.trim().toLowerCase())) {
      this.errorMsg = 'An item with this name already exists.';
      return;
    }
    // Set status based on quantity
    let status = 'In Stock';
    if (this.newItem.quantity === 0) {
      status = 'Out of Stock';
    } else if (this.newItem.quantity < 5) {
      status = 'Low Stock';
    }
    const newItem = { ...this.newItem, status };
    this.items.push(newItem);
    this.saveInventoryToJson();
    this.newItem = { name: '', quantity: 0, status: 'In Stock' };
    this.nameTouched = false;
    this.quantityTouched = false;
    this.errorMsg = '';
  }

  async deleteItem(index: number) {
    const confirm = window.confirm('Are you sure you want to delete this inventory item?');
    if (confirm) {
      this.items.splice(index, 1);
      this.saveInventoryToJson();
    }
  }

  startEdit(index: number) {
    this.editingIndex = index;
    this.editItem = { ...this.items[index] };
  }

  saveEdit() {
    if (this.editItem.name && this.editItem.quantity >= 0) {
      // Set status based on quantity
      let status = 'In Stock';
      if (this.editItem.quantity === 0) {
        status = 'Out of Stock';
      } else if (this.editItem.quantity < 5) {
        status = 'Low Stock';
      }
      if (this.editingIndex !== null) {
        this.items[this.editingIndex] = { ...this.editItem, status };
        this.saveInventoryToJson();
        this.editingIndex = null;
      }
    }
  }

  saveInventoryToJson() {
    this.http.put('http://localhost:3001/api/inventory', this.items).subscribe({
      next: () => {
        console.log('Inventory saved to JSON via API.');
      },
      error: (err) => {
        console.error('Failed to save inventory:', err);
      }
    });
  }

  cancelEdit() {
    this.editingIndex = null;
  }

  setSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
  }

  get filteredItems(): InventoryItem[] {
    let filtered = this.items;
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(term));
    }
    if (this.sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        let valA = (a as any)[this.sortColumn];
        let valB = (b as any)[this.sortColumn];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }

  get pagedItems(): InventoryItem[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredItems.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredItems.length / this.itemsPerPage);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
