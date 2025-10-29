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

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        if (response.success && response.data) {
          this.storeTokens(response.data.token, response.data.refreshToken);
          return response.data;
        }
        throw new Error(response.message || 'Login failed');
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this.clearTokens()),
      map(() => undefined),
      catchError(err => {
        this.clearTokens();
        throw err;
      })
    );
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
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  private storeTokens(token: string, refreshToken: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }
}