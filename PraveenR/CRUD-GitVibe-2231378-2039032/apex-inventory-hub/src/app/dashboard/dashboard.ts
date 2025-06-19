import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatChipsModule, CommonModule],
})
export class DashboardComponent implements OnInit {
  total = 0;
  lowStock = 0;
  outOfStock = 0;

  constructor(private inv: InventoryService) {}

  ngOnInit() {
    this.inv.items$.subscribe(items => {
      this.total = items.length;
      this.lowStock = items.filter(i => i.quantity > 0 && i.quantity < 10).length;
      this.outOfStock = items.filter(i => i.quantity === 0).length;
    });
  }
}
