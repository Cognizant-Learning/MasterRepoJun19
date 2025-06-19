import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import * as XLSX from 'xlsx';

interface InventoryItem {
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  selected?: boolean; // For bulk selection
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
  newItem: InventoryItem = { name: '', sku: '', category: '', price: 0, quantity: 0 };
  errorMsg = '';
  nameTouched = false;
  skuTouched = false;
  categoryTouched = false;
  priceTouched = false;
  quantityTouched = false;
  editingIndex: number | null = null;
  editItem: InventoryItem = { name: '', sku: '', category: '', price: 0, quantity: 0 };
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  allSelected = false;
  selectedCount = 0;

  // Bulk delete selection
  selectedItems: Set<string> = new Set();
  selectAllChecked: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<InventoryItem[]>('http://localhost:3001/api/inventory').subscribe({
      next: (data) => {
        // Ensure no checkboxes are checked by default
        this.items = data.map(item => ({ ...item, selected: false }));
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
    this.skuTouched = true;
    this.categoryTouched = true;
    this.priceTouched = true;
    this.quantityTouched = true;
    this.errorMsg = '';
    if (!this.newItem.name || !this.newItem.sku || !this.newItem.category || this.newItem.price === null || this.newItem.price < 0 || this.newItem.quantity === null || this.newItem.quantity < 0) {
      this.errorMsg = 'All fields are required and must be valid.';
      return;
    }
    if (this.items.some(item => item.name.trim().toLowerCase() === this.newItem.name.trim().toLowerCase() && item.sku.trim().toLowerCase() === this.newItem.sku.trim().toLowerCase())) {
      this.errorMsg = 'An item with this name and SKU already exists.';
      return;
    }
    // Add item
    const newItem = { ...this.newItem };
    this.items.push(newItem);
    this.saveInventoryToJson();
    this.newItem = { name: '', sku: '', category: '', price: 0, quantity: 0 };
    this.nameTouched = false;
    this.skuTouched = false;
    this.categoryTouched = false;
    this.priceTouched = false;
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
    if (this.editItem.name && this.editItem.sku && this.editItem.category && this.editItem.price !== null && this.editItem.price >= 0 && this.editItem.quantity !== null && this.editItem.quantity >= 0) {
      if (this.editingIndex !== null) {
        this.items[this.editingIndex] = { ...this.editItem };
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
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.sku.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );
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

  get totalUniqueItems(): number {
    // Unique by name (case-insensitive)
    const names = new Set(this.items.map(item => item.name.trim().toLowerCase()));
    return names.size;
  }

  get lowStockCount(): number {
    return this.items.filter(item => item.quantity > 0 && item.quantity < 5).length;
  }
  get outOfStockCount(): number {
    return this.items.filter(item => item.quantity === 0).length;
  }

  downloadAsXLS() {
    // Prepare data for export
    const exportData = this.filteredItems.map(item => ({
      Name: item.name,
      SKU: item.sku,
      Category: item.category,
      Price: item.price,
      Quantity: item.quantity
    }));
    // Use the xlsx API in a way that works with the installed version
    const worksheet = (XLSX as any).utils.json_to_sheet(exportData);
    // Use XLSX.utils.book_new and book_append_sheet if available, else fallback
    let workbook;
    if ((XLSX as any).utils.book_new && (XLSX as any).utils.book_append_sheet) {
      workbook = (XLSX as any).utils.book_new();
      (XLSX as any).utils.book_append_sheet(workbook, worksheet, 'Inventory');
    } else {
      workbook = { SheetNames: ['Inventory'], Sheets: { 'Inventory': worksheet }, Props: {} };
    }
    XLSX.writeFile(workbook, 'inventory.xlsx');
  }

  // Toggle all checkboxes on current page
  toggleSelectAll() {
    this.pagedItems.forEach(item => item.selected = this.allSelected);
    this.updateSelectedCount();
  }

  // When a single checkbox changes
  onItemSelectChange() {
    this.selectedCount = this.pagedItems.filter(item => item.selected).length;
    this.allSelected = this.selectedCount === this.pagedItems.length && this.pagedItems.length > 0;
  }

  // Update selected count (helper)
  updateSelectedCount() {
    this.selectedCount = this.pagedItems.filter(item => item.selected).length;
  }

  // Confirm and perform bulk delete
  confirmBulkDelete() {
    if (this.selectedCount === 0) return;
    if (window.confirm(`Are you sure you want to delete ${this.selectedCount} selected item(s)?`)) {
      const selectedSkus = this.pagedItems.filter(item => item.selected).map(item => item.sku);
      this.items = this.items.filter(item => !selectedSkus.includes(item.sku));
      this.saveInventoryToJson();
      this.selectedCount = 0;
      this.allSelected = false;
    }
  }
}
