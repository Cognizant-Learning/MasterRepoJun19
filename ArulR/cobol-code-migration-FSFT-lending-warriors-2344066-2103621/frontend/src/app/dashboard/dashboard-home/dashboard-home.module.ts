import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// NgChartsModule now imported since dependencies are installed
import { NgChartsModule } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';

import { DashboardHomeComponent } from './dashboard-home.component';
// import { DashboardHomeRoutingModule } from './dashboard-home-routing.module';

@NgModule({
  declarations: [
    DashboardHomeComponent
  ],  imports: [    CommonModule,
    RouterModule,
    // Temporarily use RouterModule directly until DashboardHomeRoutingModule is fixed
    RouterModule.forChild([
      { path: '', component: DashboardHomeComponent }
    ]),
    // NgChartsModule now included since dependencies are installed
    NgChartsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatGridListModule,
    MatListModule
  ]
})
export class DashboardHomeModule { }
