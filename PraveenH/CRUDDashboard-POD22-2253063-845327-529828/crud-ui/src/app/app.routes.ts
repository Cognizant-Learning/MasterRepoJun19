import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { List } from './components/list/list';
import { Create } from './components/create/create';
import { Edit } from './components/edit/edit';
import { View } from './components/view/view';
import { LoginComponent } from './components/auth/login/login';
import { SignupComponent } from './components/auth/signup/signup';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [loginGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'list', component: List, canActivate: [authGuard] },
  { path: 'create', component: Create, canActivate: [authGuard] },
  { path: 'edit/:id', component: Edit, canActivate: [authGuard] },
  { path: 'view/:id', component: View, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' } // Redirect to login for any unknown routes
];
