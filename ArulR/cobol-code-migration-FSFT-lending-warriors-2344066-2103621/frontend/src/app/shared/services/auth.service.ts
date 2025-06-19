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

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => this.clearSession()),
        catchError(error => {
          console.error('Logout failed', error);
          // Clear session anyway
          this.clearSession();
          return of(null);
        })
      );
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
