import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    // User is not logged in, redirect to login page
    router.navigate(['/login']);
    return false;
  }
  
  // User is logged in, allow access to the route
  return true;
};

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (isLoggedIn) {
    // User is already logged in, redirect to dashboard
    router.navigate(['/dashboard']);
    return false;
  }
  
  // User is not logged in, allow access to login/signup pages
  return true;
};
