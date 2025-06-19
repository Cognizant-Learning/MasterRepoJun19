import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { List } from './components/list/list';
import { Create } from './components/create/create';
import { Edit } from './components/edit/edit';
import { View } from './components/view/view';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'list', component: List },
  { path: 'create', component: Create },
  { path: 'edit/:id', component: Edit },
  { path: 'view/:id', component: View },
  { path: '**', redirectTo: '/dashboard' } // Redirect to dashboard for any unknown routes
];
