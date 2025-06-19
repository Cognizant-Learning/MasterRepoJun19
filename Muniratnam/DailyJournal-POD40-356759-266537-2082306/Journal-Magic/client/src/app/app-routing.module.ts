import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { JournalEntryComponent } from './pages/journal-entry/journal-entry.component';
import { JournalListComponent } from './pages/journal-list/journal-list.component';

// Guards
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: '', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'journal', 
    component: JournalListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'journal/new', 
    component: JournalEntryComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'journal/:id', 
    component: JournalEntryComponent, 
    canActivate: [AuthGuard] 
  },
  // Redirect any unknown paths to dashboard (which is protected by AuthGuard)
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
