import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customers.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'new',
    component: CustomerFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'MANAGER'] }
  },
  {
    path: ':id',
    component: CustomerDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id/edit',
    component: CustomerFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'MANAGER'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
