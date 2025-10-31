import { createReducer, on } from '@ngrx/store';
import { User } from '../../models';
import * as AuthPageActions from './auth-page.actions';
import * as AuthApiActions from './auth-api.actions';

// Auth feature state
export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

export const authReducer = createReducer<AuthState>(
  initialState,
  // Init
  on(AuthApiActions.initSuccess, (state, action): AuthState => {
    return {
      ...state,
      user: action.user,
      token: action.token,
      loading: false,
      error: null,
      isAuthenticated: true
    };
  }),
  // Login
  on(AuthPageActions.login, (state): AuthState => {
    return {
      ...state,
      loading: true,
      error: null
    };
  }),
  on(AuthApiActions.loginSuccess, (state, action): AuthState => {
    return {
      ...state,
      user: action.response.user || null,
      token: action.response.token || null,
      loading: false,
      error: null,
      isAuthenticated: true
    };
  }),
  on(AuthApiActions.loginFailure, (state, action): AuthState => {
    return {
      ...state,
      user: null,
      token: null,
      loading: false,
      error: action.error,
      isAuthenticated: false
    };
  }),

  // Logout
  on(AuthPageActions.logout, (state): AuthState => {
    return {
      ...state,
      loading: false
    };
  }),
  on(AuthApiActions.logoutSuccess, (): AuthState => {
    return {
      ...initialState
    };
  }),

  // Clear Error
  on(AuthPageActions.clearError, (state): AuthState => {
    return {
      ...state,
      error: null
    };
  })
);
