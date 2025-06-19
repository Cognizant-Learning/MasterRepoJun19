import { Component } from '@angular/core';
import { InventoryListComponent } from './components/inventory-list.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'inventory-dashboard';
}
