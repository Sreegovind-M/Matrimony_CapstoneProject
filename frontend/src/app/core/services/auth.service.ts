import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of, map } from 'rxjs';
import { User } from '../models/user.model';

interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

interface RegisterResponse {
  success: boolean;
  user?: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {
    // Restore user from localStorage on service init
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, { email, password }).pipe(
      tap(response => {
        if (response.success && response.user) {
          this.setCurrentUser(response.user);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of({
          success: false,
          message: error.error?.message || 'Login failed. Please try again.'
        });
      })
    );
  }

  register(userData: { name: string; email: string; password: string; phone: string; role: string }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API_URL}/register`, userData).pipe(
      tap(response => {
        // Auto-login user after successful registration
        if (response.success && response.user) {
          this.setCurrentUser(response.user);
        }
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return of({
          success: false,
          message: error.error?.message || 'Registration failed. Please try again.'
        });
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getRole(): User['role'] | null {
    return this.currentUserSubject.value?.role || null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  updateStoredUser(user: any): void {
    const current = this.getCurrentUser();
    if (current) {
      const updated = { ...current, ...user };
      this.currentUserSubject.next(updated);
      localStorage.setItem('currentUser', JSON.stringify(updated));
    }
  }
}
