import { createAction, props } from '@ngrx/store';
import { AuthResponse, User } from '../../models';

// API Actions - API response actions
export const initSuccess = createAction(
  '[Auth API] Init Success',
  props<{ user: User; token: string }>()
);

export const loginSuccess = createAction(
  '[Auth API] Login Success',
  props<{ response: AuthResponse }>()
);

export const loginFailure = createAction(
  '[Auth API] Login Failure',
  props<{ error: string }>()
);

export const logoutSuccess = createAction(
  '[Auth API] Logout Success'
);
