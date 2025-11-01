import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const getAuthFeatureState = createFeatureSelector<AuthState>('auth');

export const getUser = createSelector(
  getAuthFeatureState,
  state => state.user
);

export const getToken = createSelector(
  getAuthFeatureState,
  state => state.token
);

export const getLoading = createSelector(
  getAuthFeatureState,
  state => state.loading
);

export const getError = createSelector(
  getAuthFeatureState,
  state => state.error
);

export const getIsAuthenticated = createSelector(
  getAuthFeatureState,
  state => state.isAuthenticated
);

export const getUserName = createSelector(
  getUser,
  user => user?.name || ''
);

export const getUserEmail = createSelector(
  getUser,
  user => user?.email || ''
);

export const getHasError = createSelector(
  getError,
  error => !!error
);

export const getIsLoading = createSelector(
  getLoading,
  loading => loading
);
