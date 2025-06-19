import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges {
  @Input() items: Item[] = [];
  
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };
  
  chartData: ChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Quantity',
        backgroundColor: [
          '#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', 
          '#3F51B5', '#00BCD4', '#009688', '#FFEB3B', '#795548'
        ]
      }
    ]
  };

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && this.items) {
      this.updateChart();
    }
  }

  updateChart(): void {
    // Group items by category and sum quantities
    const categoryMap = new Map<string, number>();
    
    this.items.forEach(item => {
      const currentTotal = categoryMap.get(item.category) || 0;
      categoryMap.set(item.category, currentTotal + item.quantity);
    });
    
    // Update chart data
    this.chartData.labels = Array.from(categoryMap.keys());
    this.chartData.datasets[0].data = Array.from(categoryMap.values());
  }
}
