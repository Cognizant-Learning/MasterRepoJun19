import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User, AuthResponse } from '../models/user.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => this.setAuthData(response)),
        catchError(error => {
          console.error('Login error', error);
          throw error;
        })
      );
  }

  register(user: Partial<User>, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, { ...user, password })
      .pipe(
        tap(response => this.setAuthData(response)),
        catchError(error => {
          console.error('Registration error', error);
          throw error;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    this.currentUserSubject.next(null);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh-token`, {})
      .pipe(
        tap(response => this.setAuthData(response)),
        catchError(error => {
          this.logout();
          return of(error);
        })
      );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('tokenExpiration');
    
    if (!token || !expirationDate) {
      return false;
    }
    
    return new Date(expirationDate) > new Date();
  }

  private setAuthData(authResult: AuthResponse): void {
    const expirationDate = authResult.expiresAt;
    
    localStorage.setItem('currentUser', JSON.stringify(authResult.user));
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('tokenExpiration', expirationDate.toString());
    
    this.currentUserSubject.next(authResult.user);
    this.autoLogout(new Date(expirationDate).getTime() - new Date().getTime());
  }

  private autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
