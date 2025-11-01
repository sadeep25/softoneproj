import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from './task.reducer';
import { Task, TaskStatus, TaskPriority } from '../../models';

export const getTaskFeatureState = createFeatureSelector<TaskState>('tasks');

export const getTasks = createSelector(
  getTaskFeatureState,
  state => state.tasks
);

export const getLoading = createSelector(
  getTaskFeatureState,
  state => state.loading
);

export const getError = createSelector(
  getTaskFeatureState,
  state => state.error
);

export const getSelectedTask = createSelector(
  getTaskFeatureState,
  state => state.selectedTask
);

export const getFilters = createSelector(
  getTaskFeatureState,
  state => state.filters
);

export const getFilteredTasks = createSelector(
  getTasks,
  (tasks) => tasks
);

export const getTasksByStatus = createSelector(
  getFilteredTasks,
  tasks => {
    return {
      toDo: tasks.filter(t => t.status === TaskStatus.ToDo),
      inProgress: tasks.filter(t => t.status === TaskStatus.InProgress),
      done: tasks.filter(t => t.status === TaskStatus.Done),
      cancelled: tasks.filter(t => t.status === TaskStatus.Cancelled)
    };
  }
);

export const getTasksByPriority = createSelector(
  getFilteredTasks,
  tasks => {
    return {
      low: tasks.filter(t => t.priority === TaskPriority.Low),
      medium: tasks.filter(t => t.priority === TaskPriority.Medium),
      high: tasks.filter(t => t.priority === TaskPriority.High),
      critical: tasks.filter(t => t.priority === TaskPriority.Critical)
    };
  }
);

export const getTaskStats = createSelector(
  getTasks,
  tasks => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === TaskStatus.Done).length,
      inProgress: tasks.filter(t => t.status === TaskStatus.InProgress).length,
      overdue: tasks.filter(
        t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== TaskStatus.Done
      ).length
    };
  }
);

export const getIsLoading = createSelector(
  getLoading,
  loading => loading
);

export const getHasError = createSelector(
  getError,
  error => !!error
);

export const getIsEmpty = createSelector(
  getTasks,
  tasks => tasks.length === 0
);
