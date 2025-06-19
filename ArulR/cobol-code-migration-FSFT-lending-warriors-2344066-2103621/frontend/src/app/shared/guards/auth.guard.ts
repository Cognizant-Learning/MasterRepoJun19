import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      // Check if route has data.roles and user has one of the required roles
      if (route.data && route.data['roles']) {
        const requiredRoles = route.data['roles'] as Array<string>;
        const canAccess = requiredRoles.some(role => this.authService.hasRole(role));
        
        if (!canAccess) {
          // User doesn't have the required role
          this.router.navigate(['/unauthorized']);
          return false;
        }
      }
      return true;
    }
    
    // Not logged in so redirect to login page with the return URL
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
