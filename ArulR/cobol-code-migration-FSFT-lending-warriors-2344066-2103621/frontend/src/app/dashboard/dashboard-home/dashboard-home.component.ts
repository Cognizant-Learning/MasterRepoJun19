import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  // Dashboard cards
  cards = [
    { title: 'Total Balance', cols: 1, rows: 1, type: 'balance', value: 12500.75, change: 2.3 },
    { title: 'Monthly Transactions', cols: 1, rows: 1, type: 'transactions', value: 28 },
    { title: 'Recent Activity', cols: 1, rows: 1, type: 'activity' },
    { title: 'Quick Actions', cols: 1, rows: 1, type: 'actions' }
  ];
  // Transaction chart data
  transactionChartData: ChartData<'bar'> = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [5, 10, 8, 5],
        label: 'Deposits',
        backgroundColor: 'rgba(0, 200, 83, 0.5)'
      },
      {
        data: [3, 8, 6, 3],
        label: 'Withdrawals',
        backgroundColor: 'rgba(244, 67, 54, 0.5)'
      }
    ]
  };

  // Chart options
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  };

  // Recent activities
  recentActivities = [
    { 
      type: 'deposit', 
      icon: 'arrow_upward', 
      description: 'Deposit from Employer Inc.',
      amount: 1250.00, 
      date: new Date(2025, 5, 18) 
    },
    { 
      type: 'withdrawal', 
      icon: 'arrow_downward', 
      description: 'ATM Withdrawal',
      amount: 200.00, 
      date: new Date(2025, 5, 17) 
    },
    { 
      type: 'transfer', 
      icon: 'swap_horiz', 
      description: 'Transfer to Savings Account',
      amount: 500.00, 
      date: new Date(2025, 5, 15) 
    },
    { 
      type: 'alert', 
      icon: 'notifications', 
      description: 'Account verification completed',
      date: new Date(2025, 5, 14) 
    }
  ];

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    // Responsive layout based on screen size
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(({ matches }) => {
        if (matches) {
          return this.cards.map(card => ({
            ...card,
            cols: 2,
            rows: 1
          }));
        }
        return this.cards;
      })
    ).subscribe(cards => this.cards = cards);
  }
}
