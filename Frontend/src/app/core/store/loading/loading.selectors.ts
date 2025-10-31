import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoadingState } from './loading.reducer';

export const selectLoadingState = createFeatureSelector<LoadingState>('loading');

export const selectIsLoading = createSelector(
  selectLoadingState,
  (state: LoadingState) => state.isLoading
);

export const selectOperations = createSelector(
  selectLoadingState,
  (state: LoadingState) => Array.from(state.operations)
);

export const selectIsOperationLoading = (operation: string) =>
  createSelector(
    selectLoadingState,
    (state: LoadingState) => state.operations.has(operation)
  );
