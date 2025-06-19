import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService, InventoryItem } from '../services/inventory.service';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Inventory Items</h2>
    <ul>
      <li *ngFor="let item of items">
        {{ item.name }} (Qty: {{ item.quantity }})
      </li>
    </ul>
    <div *ngIf="error" style="color:red">{{ error }}</div>
  `
})
export class InventoryListComponent implements OnInit {
  items: InventoryItem[] = [];
  error: string | null = null;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.inventoryService.getAllItems().subscribe({
      next: (data: InventoryItem[]) => this.items = data,
      error: (_err: unknown) => this.error = 'Failed to load inventory items.'
    });
  }
}
