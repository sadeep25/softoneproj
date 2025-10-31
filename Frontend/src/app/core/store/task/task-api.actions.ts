import { createAction, props } from '@ngrx/store';
import { Task } from '../../models';

// API Actions - API response actions
export const loadTasksSuccess = createAction(
  '[Task API] Load Tasks Success',
  props<{ tasks: Task[] }>()
);

export const loadTasksFailure = createAction(
  '[Task API] Load Tasks Failure',
  props<{ error: string }>()
);

export const createTaskSuccess = createAction(
  '[Task API] Create Task Success',
  props<{ task: Task }>()
);

export const createTaskFailure = createAction(
  '[Task API] Create Task Failure',
  props<{ error: string }>()
);

export const updateTaskSuccess = createAction(
  '[Task API] Update Task Success',
  props<{ task: Task }>()
);

export const updateTaskFailure = createAction(
  '[Task API] Update Task Failure',
  props<{ error: string }>()
);

export const deleteTaskSuccess = createAction(
  '[Task API] Delete Task Success',
  props<{ id: string }>()
);

export const deleteTaskFailure = createAction(
  '[Task API] Delete Task Failure',
  props<{ error: string }>()
);
