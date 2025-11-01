import { createAction, props } from '@ngrx/store';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus, TaskPriority } from '../../models';

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  searchTerm?: string;
}

export const loadTasks = createAction(
  '[Task Page] Load Tasks'
);

export const createTask = createAction(
  '[Task Page] Create Task',
  props<{ task: CreateTaskDto }>()
);

export const updateTask = createAction(
  '[Task Page] Update Task',
  props<{ id: string; updates: UpdateTaskDto }>()
);

export const deleteTask = createAction(
  '[Task Page] Delete Task',
  props<{ id: string }>()
);

export const selectTask = createAction(
  '[Task Page] Select Task',
  props<{ task: Task | null }>()
);

export const setFilters = createAction(
  '[Task Page] Set Filters',
  props<{ filters: Partial<TaskFilters> }>()
);

export const clearFilters = createAction(
  '[Task Page] Clear Filters'
);

export const clearCurrentTask = createAction(
  '[Task Page] Clear Current Task'
);

export const clearError = createAction(
  '[Task Page] Clear Error'
);
