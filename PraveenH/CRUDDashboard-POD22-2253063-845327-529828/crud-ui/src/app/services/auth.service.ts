import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private router: Router) {
    // Check if user is logged in on service initialization
    this.checkAuthStatus();
  }

  /**
   * Check user authentication status from local storage
   */
  checkAuthStatus(): boolean {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedInSubject.next(isLoggedIn);
    return isLoggedIn;
  }

  /**
   * Login user
   * @param email User email
   * @param password User password
   */
  login(email: string, password: string): Promise<boolean> {
    // In a real app, this would call an API endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock successful login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({ email }));
        this.isLoggedInSubject.next(true);
        resolve(true);
      }, 1000);
    });
  }

  /**
   * Register a new user
   * @param userData User registration data
   */
  register(userData: { name: string, email: string, password: string }): Promise<boolean> {
    // In a real app, this would call an API endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock successful registration
        localStorage.setItem('registeredUser', JSON.stringify(userData));
        resolve(true);
      }, 1000);
    });
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * Get current user
   */
  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
