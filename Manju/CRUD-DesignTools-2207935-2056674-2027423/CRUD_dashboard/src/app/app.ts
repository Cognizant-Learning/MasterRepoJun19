import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InventoryDashboardComponent } from './inventory-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InventoryDashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'CRUD_dashboard';
}
