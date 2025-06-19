import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-dashboard',
  template: '',
})
export class DashboardComponent implements OnInit {
  keyStats = {
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0
  };

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.inventoryService.getAllItems().subscribe(items => {
      this.keyStats.totalItems = items.length;
    });
    this.inventoryService.getLowStockItems().subscribe(items => {
      this.keyStats.lowStock = items.length;
    });
    this.inventoryService.getOutOfStockItems().subscribe(items => {
      this.keyStats.outOfStock = items.length;
    });
  }
}
