import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { InventoryService, InventoryItem } from '../services/inventory';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ItemForm } from '../item-form/item-form';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-inventory-table',
  templateUrl: './inventory-table.html',
  styleUrls: ['./inventory-table.scss'],
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, MatCheckboxModule, MatSortModule, CommonModule, FormsModule]
})
export class InventoryTableComponent implements OnInit, AfterViewInit {
  displayedColumns = ['select', 'name', 'sku', 'category', 'price', 'quantity', 'actions'];
  search = '';
  items: InventoryItem[] = [];
  selection = new Set<number>();
  dataSource = new MatTableDataSource<InventoryItem>([]);
  @ViewChild(MatSort) sort!: MatSort;

  editingRowId: number | null = null;
  editRow: Partial<InventoryItem> = {};
  addingNew: boolean = false;
  newRow: Partial<InventoryItem> = { name: '', sku: '', category: '', price: 0, quantity: 0 };

  constructor(public inv: InventoryService, private dialog: MatDialog, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.inv.items$.subscribe(items => {
      this.items = items;
      this.updateDataSource();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.updateDataSource();
  }

  get filteredItems() {
    return this.items.filter(item =>
      Object.values(item).some(val => val.toString().toLowerCase().includes(this.search.toLowerCase()))
    );
  }

  updateDataSource() {
    this.dataSource.data = this.filteredItems;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  toggleSelection(item: InventoryItem) {
    if (this.selection.has(item.id)) {
      this.selection.delete(item.id);
    } else {
      this.selection.add(item.id);
    }
  }

  isAllSelected() {
    return this.filteredItems.length > 0 && this.filteredItems.every(item => this.selection.has(item.id));
  }

  isIndeterminate() {
    const selectedCount = this.filteredItems.filter(item => this.selection.has(item.id)).length;
    return selectedCount > 0 && selectedCount < this.filteredItems.length;
  }

  toggleSelectAll(event: any) {
    if (event.checked) {
      this.filteredItems.forEach(item => this.selection.add(item.id));
    } else {
      this.filteredItems.forEach(item => this.selection.delete(item.id));
    }
  }

  openForm(item?: InventoryItem) {
    if (item) {
      this.editingRowId = item.id;
      this.editRow = { ...item };
      this.addingNew = false;
    } else {
      // Open modal for new item
      const dialogRef = this.dialog.open(ItemForm, {
        width: '400px',
        data: { item: { name: '', sku: '', category: '', price: 0, quantity: 0 } }
      });
      dialogRef.afterClosed().subscribe((result: InventoryItem | undefined) => {
        if (result) {
          this.inv.addItem(result);
        }
      });
    }
  }

  saveEdit(item: InventoryItem) {
    this.inv.updateItem({ ...item, ...this.editRow });
    this.editingRowId = null;
    this.editRow = {};
  }

  cancelEdit() {
    this.editingRowId = null;
    this.editRow = {};
  }

  saveNew() {
    if (this.newRow.name && this.newRow.sku && this.newRow.category && this.newRow.price != null && this.newRow.quantity != null) {
      this.inv.addItem(this.newRow as InventoryItem);
      this.addingNew = false;
      this.newRow = { name: '', sku: '', category: '', price: 0, quantity: 0 };
    }
  }

  cancelNew() {
    this.addingNew = false;
    this.newRow = { name: '', sku: '', category: '', price: 0, quantity: 0 };
  }

  confirmDelete(item: InventoryItem) {
    this.inv.deleteItem(item.id);
  }

  deleteSelected() {
    this.selection.forEach(id => this.inv.deleteItem(id));
    this.selection.clear();
  }

  getRowClass(item: InventoryItem) {
    if (item.quantity === 0) return 'out-of-stock';
    if (item.quantity > 0 && item.quantity < 10) return 'low-stock';
    return '';
  }

  onSearchChange(val: string) {
    this.search = val;
    this.updateDataSource();
  }
}
