import { createAction, props } from '@ngrx/store';
import { ApiResponse, AuthResponse, User } from '../../models';

export const initSuccess = createAction(
  '[Auth API] Init Success',
  props<{ user: User; token: string }>()
);

export const loginSuccess = createAction(
  '[Auth API] Login Success',
  props<{ response: ApiResponse<AuthResponse> }>()
);

export const loginFailure = createAction(
  '[Auth API] Login Failure',
  props<{ error: string }>()
);

export const logoutSuccess = createAction(
  '[Auth API] Logout Success'
);

export const initFailure = createAction(
  '[Auth API] Init Failure'
);
