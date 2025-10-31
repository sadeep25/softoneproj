import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, AuthResponse, ApiResponse } from '../models/auth.models';
import { environment } from '../../../../environments/environment';

/**
 * Auth Service - Pure HTTP service with no state management
 * All state is managed by NgRx store
 * LocalStorage persistence is handled by NgRx effects
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  /**
   * Login - Makes HTTP call only
   * State management handled by NgRx (effects + reducer)
   */
  login(loginRequest: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${environment.apiUrl}/api/auth/login`,
      loginRequest
    );
  }
}
