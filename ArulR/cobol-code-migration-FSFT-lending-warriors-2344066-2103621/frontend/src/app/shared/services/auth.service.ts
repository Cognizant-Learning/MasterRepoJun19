import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { JwtResponse } from '../models/jwt-response.model';
import { LoginRequest } from '../models/login-request.model';
import { User } from '../models/user.model';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = `${environment.apiUrl}/auth`;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  
  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }
  login(loginRequest: LoginRequest): Observable<JwtResponse> {
    // Use mock authentication if enabled in environment
    if (environment.useMockAuth) {
      return this.mockLogin(loginRequest);
    }
    
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          this.saveToken(response.token);
          this.saveUser({
            id: response.id,
            username: response.username,
            email: response.email,
            roles: response.roles
          });
          this.currentUserSubject.next(this.getUserFromStorage());
          this.isLoggedInSubject.next(true);
        }),
        catchError(error => {
          console.error('Login failed', error);
          return throwError(() => new Error('Login failed. Please check your username and password.'));
        })
      );
  }
  
  private mockLogin(loginRequest: LoginRequest): Observable<JwtResponse> {
    console.log('Using mock authentication');
    
    // For demo purposes, accept any username/password where password is not empty
    if (loginRequest.username && loginRequest.password) {
      // Create a mock JWT response
      const mockResponse: JwtResponse = {
        token: 'mock-jwt-token-' + Math.random().toString(36).substring(2),
        id: 1,
        username: loginRequest.username,
        email: `${loginRequest.username}@example.com`,
        roles: ['USER']
      };
      
      // Store the mock data
      this.saveToken(mockResponse.token);
      this.saveUser({
        id: mockResponse.id,
        username: mockResponse.username,
        email: mockResponse.email,
        roles: mockResponse.roles
      });
      this.currentUserSubject.next(this.getUserFromStorage());
      this.isLoggedInSubject.next(true);
      
      return of(mockResponse);
    } else {
      return throwError(() => new Error('Login failed. Please provide username and password.'));
    }
  }
  logout(): Observable<any> {
    // First clear the session locally to prevent UI issues
    const token = this.getToken();
    this.clearSession();
    
    // Only make the logout API call if we had a token
    if (token) {
      return this.http.post(`${this.apiUrl}/logout`, {})
        .pipe(
          // Session already cleared, just return
          catchError(error => {
            console.error('Logout failed', error);
            return of(null);
          })
        );
    } else {
      // If no token, just return an Observable that completes
      return of(null);
    }
  }

  private clearSession(): void {
    window.sessionStorage.clear();
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    // Check if token exists
    return !!token;
  }

  getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  saveUser(user: User): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  getUserFromStorage(): User | null {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }
  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    return user.roles.includes(role);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }
}
