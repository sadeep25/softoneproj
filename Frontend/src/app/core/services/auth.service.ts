import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, AuthResponse, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;
  private readonly tokenKey = 'task_manager_token';
  private readonly refreshTokenKey = 'task_manager_refresh_token';
  private readonly userKey = 'task_manager_user';
  private readonly loggedInKey = 'task_manager_logged_in';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        if (response.success && response.data) {
          this.storeTokens(response.data.token, response.data.refreshToken);
          if (response.data.user) {
            localStorage.setItem(this.userKey, JSON.stringify(response.data.user));
          }
          if (!response.data.token && response.data.user) {
            localStorage.setItem(this.loggedInKey, '1');
          }
          return response.data;
        }
        throw new Error(response.message || 'Login failed');
      })
    );
  }

  logout(): void {
    this.clearTokens();
  }

  refreshToken(): Observable<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return of(null);
    }

    return this.http.post<ApiResponse<{ token: string; refreshToken: string }>>(
      `${this.apiUrl}/refresh`,
      { refreshToken }
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          this.storeTokens(response.data.token, response.data.refreshToken);
          return response.data.token;
        }
        return null;
      }),
      catchError(() => {
        this.clearTokens();
        return of(null);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload && typeof payload.exp === 'number') {
          return payload.exp * 1000 > Date.now();
        }
      }
      return true;
    } catch {
      return true;
    }
  }

  private storeTokens(token?: string, refreshToken?: string): void {
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    }
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  clearTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.loggedInKey);
  }

  getStoredUser(): User | null {
    const userJson = localStorage.getItem(this.userKey);
    if (userJson) {
      try {
        return JSON.parse(userJson) as User;
      } catch {
        return null;
      }
    }
    return null;
  }
}