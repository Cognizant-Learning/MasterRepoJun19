import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private itemsSubject = new BehaviorSubject<InventoryItem[]>(
    [
      { id: 1, name: 'Item A', sku: 'SKU001', category: 'Category 1', price: 100, quantity: 12 },
      { id: 2, name: 'Item B', sku: 'SKU002', category: 'Category 2', price: 50, quantity: 5 },
      { id: 3, name: 'Item C', sku: 'SKU003', category: 'Category 1', price: 75, quantity: 0 }
    ]
  );
  items$ = this.itemsSubject.asObservable();

  get items() { return this.itemsSubject.value; }

  addItem(item: InventoryItem) {
    item.id = Date.now();
    this.itemsSubject.next([...this.items, item]);
  }

  updateItem(updated: InventoryItem) {
    this.itemsSubject.next(this.items.map(i => i.id === updated.id ? updated : i));
  }

  deleteItem(id: number) {
    this.itemsSubject.next(this.items.filter(i => i.id !== id));
  }
}
