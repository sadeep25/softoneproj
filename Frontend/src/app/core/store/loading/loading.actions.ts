import { createAction, props } from '@ngrx/store';

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
