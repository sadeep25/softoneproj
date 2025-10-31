import { createReducer, on } from '@ngrx/store';
import * as LoadingActions from './loading.actions';

export interface LoadingState {
  operations: Set<string>;
  isLoading: boolean;
}

export const initialState: LoadingState = {
  operations: new Set<string>(),
  isLoading: false
};

export const loadingReducer = createReducer(
  initialState,
  on(LoadingActions.startLoading, (state, { operation }) => {
    const operations = new Set(state.operations);
    operations.add(operation);
    return {
      ...state,
      operations,
      isLoading: operations.size > 0
    };
  }),
  on(LoadingActions.stopLoading, (state, { operation }) => {
    const operations = new Set(state.operations);
    operations.delete(operation);
    return {
      ...state,
      operations,
      isLoading: operations.size > 0
    };
  }),
  on(LoadingActions.clearAllLoading, (state) => ({
    ...state,
    operations: new Set<string>(),
    isLoading: false
  }))
);
