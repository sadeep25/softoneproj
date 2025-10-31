import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, AuthResponse, ApiResponse, User } from '../models/auth.models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    // Check if user is logged in on service initialization
    this.checkStoredAuth();
  }

  login(loginRequest: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${environment.apiUrl}/api/auth/login`,
      loginRequest
    ).pipe(
      tap(response => {
        if (response.success && response.data.success && response.data.user) {
          this.setCurrentUser(response.data.user);
          this.storeAuthData(response.data);
        }
      })
    );
  }

  logout(): void {
    this.clearAuthData();
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isLoggedInSubject.next(true);
  }

  private storeAuthData(authResponse: AuthResponse): void {
    if (authResponse.user) {
      localStorage.setItem('currentUser', JSON.stringify(authResponse.user));
      localStorage.setItem('isLoggedIn', 'true');
      if (authResponse.token) {
        localStorage.setItem('token', authResponse.token);
      }
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
  }

  private checkStoredAuth(): void {
    const storedUser = localStorage.getItem('currentUser');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (storedUser && isLoggedIn) {
      try {
        const user: User = JSON.parse(storedUser);
        this.setCurrentUser(user);
      } catch (error) {
        this.clearAuthData();
      }
    }
  }
}