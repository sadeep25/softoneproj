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
  private readonly loggedInKey = 'task_manager_logged_in';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        if (response.success && response.data) {
          this.storeTokens(response.data.token, response.data.refreshToken);
          // If backend doesn't emit tokens (e.g. Token is null), set a fallback logged-in flag
          if (!response.data.token && response.data.user) {
            localStorage.setItem(this.loggedInKey, '1');
          }
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

    // If token looks like a JWT (three parts separated by '.'), try to validate exp.
    // If it's not a JWT (opaque token), assume presence means authenticated.
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        // If exp exists, check expiry. If not present, assume token is valid.
        if (payload && typeof payload.exp === 'number') {
          return payload.exp * 1000 > Date.now();
        }
      }
      // If we couldn't parse a valid exp claim, but token exists, treat as authenticated.
      return true;
    } catch {
      // On any parsing error, fallback to treating the token as valid (opaque token case).
      return true;
    }
  }

  private storeTokens(token?: string, refreshToken?: string): void {
    // Only set items when values are provided (they may be optional on the API response)
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    }
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  private clearTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.loggedInKey);
  }
}