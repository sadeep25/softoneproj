import { createAction, props } from '@ngrx/store';
import { LoginRequest } from '../../models';

// Page Actions - User interactions
export const init = createAction(
  '[Auth Page] Init'
);

export const login = createAction(
  '[Auth Page] Login',
  props<{ credentials: LoginRequest }>()
);

export const logout = createAction(
  '[Auth Page] Logout'
);

export const clearError = createAction(
  '[Auth Page] Clear Error'
);
