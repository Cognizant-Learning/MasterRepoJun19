import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-data-visualization',
  standalone: true,
  templateUrl: './data-visualization.html',
  styleUrl: './data-visualization.scss',
  imports: [MatCardModule],
})
export class DataVisualization {
  @Input() chartData: any;
}
