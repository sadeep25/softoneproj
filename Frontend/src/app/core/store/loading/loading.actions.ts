import { createAction, props } from '@ngrx/store';

// Actions for managing loading state
export const startLoading = createAction(
  '[Loading] Start Loading',
  props<{ operation: string }>()
);

export const stopLoading = createAction(
  '[Loading] Stop Loading',
  props<{ operation: string }>()
);

export const clearAllLoading = createAction(
  '[Loading] Clear All Loading'
);
