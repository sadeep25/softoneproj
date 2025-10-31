import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, mergeMap, concatMap, withLatestFrom } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import * as TaskPageActions from './task-page.actions';
import * as TaskApiActions from './task-api.actions';
import * as NotificationActions from '../notification/notification.actions';
import { ApiResponse, Task } from '../../models';
import { getFilters } from './task.selectors';

@Injectable()
export class TaskEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private taskService = inject(TaskService);

  // Load Tasks Effect with server-side filtering
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskPageActions.loadTasks),
      withLatestFrom(this.store.select(getFilters)),
      mergeMap(([_, filters]) =>
        this.taskService.getTasks({
          status: filters.status,
          priority: filters.priority,
          searchTerm: filters.searchTerm
        }).pipe(
          map((response: ApiResponse<Task[]>) => {
            if (response.success) {
              return TaskApiActions.loadTasksSuccess({ tasks: response.data });
            } else {
              return TaskApiActions.loadTasksFailure({
                error: response.message || 'Failed to load tasks'
              });
            }
          }),
          catchError((error: any) => {
            let errorMessage = 'Failed to load tasks';

            if (error.status === 0) {
              errorMessage = 'Unable to connect to the server';
            } else if (error.status === 401) {
              errorMessage = 'Your session has expired. Please log in again';
            } else if (error.status === 500) {
              errorMessage = 'Server error occurred. Please try again later';
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            }

            return of(TaskApiActions.loadTasksFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Reload tasks when filters change (server-side filtering)
  reloadTasksOnFilterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskPageActions.setFilters, TaskPageActions.clearFilters),
      map(() => TaskPageActions.loadTasks())
    )
  );

  // Create Task Effect
  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskPageActions.createTask),
      concatMap(action =>
        this.taskService.createTask(action.task).pipe(
          map((response: ApiResponse<Task>) => {
            if (response.success) {
              return TaskApiActions.createTaskSuccess({ task: response.data });
            } else {
              return TaskApiActions.createTaskFailure({
                error: response.message || 'Failed to create task'
              });
            }
          }),
          catchError((error: any) => {
            let errorMessage = 'Failed to create task';

            if (error.status === 0) {
              errorMessage = 'Unable to connect to the server';
            } else if (error.status === 401) {
              errorMessage = 'Your session has expired. Please log in again';
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            }

            return of(TaskApiActions.createTaskFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Update Task Effect
  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskPageActions.updateTask),
      concatMap(action =>
        this.taskService.updateTask(action.id, action.updates).pipe(
          map((response: ApiResponse<Task>) => {
            if (response.success) {
              return TaskApiActions.updateTaskSuccess({ task: response.data });
            } else {
              return TaskApiActions.updateTaskFailure({
                error: response.message || 'Failed to update task'
              });
            }
          }),
          catchError((error: any) => {
            let errorMessage = 'Failed to update task';

            if (error.status === 0) {
              errorMessage = 'Unable to connect to the server';
            } else if (error.status === 401) {
              errorMessage = 'Your session has expired. Please log in again';
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            }

            return of(TaskApiActions.updateTaskFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Delete Task Effect
  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskPageActions.deleteTask),
      mergeMap(action =>
        this.taskService.deleteTask(action.id).pipe(
          map((response: ApiResponse<void>) => {
            if (response.success) {
              return TaskApiActions.deleteTaskSuccess({ id: action.id });
            } else {
              return TaskApiActions.deleteTaskFailure({
                error: response.message || 'Failed to delete task'
              });
            }
          }),
          catchError((error: any) => {
            let errorMessage = 'Failed to delete task';

            if (error.status === 0) {
              errorMessage = 'Unable to connect to the server';
            } else if (error.status === 401) {
              errorMessage = 'Your session has expired. Please log in again';
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            }

            return of(TaskApiActions.deleteTaskFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Success Notifications
  createTaskSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskApiActions.createTaskSuccess),
      map(() =>
        NotificationActions.showSuccess({
          title: 'Success',
          message: 'Task created successfully'
        })
      )
    )
  );

  updateTaskSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskApiActions.updateTaskSuccess),
      map(() =>
        NotificationActions.showSuccess({
          title: 'Success',
          message: 'Task updated successfully'
        })
      )
    )
  );

  deleteTaskSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskApiActions.deleteTaskSuccess),
      map(() =>
        NotificationActions.showSuccess({
          title: 'Success',
          message: 'Task deleted successfully'
        })
      )
    )
  );

  // Error Notifications
  loadTasksFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskApiActions.loadTasksFailure),
      map(action =>
        NotificationActions.showError({
          title: 'Load Failed',
          message: action.error,
          persistent: true
        })
      )
    )
  );

  createTaskFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskApiActions.createTaskFailure),
      map(action =>
        NotificationActions.showError({
          title: 'Creation Failed',
          message: action.error,
          persistent: true
        })
      )
    )
  );

  updateTaskFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskApiActions.updateTaskFailure),
      map(action =>
        NotificationActions.showError({
          title: 'Update Failed',
          message: action.error,
          persistent: true
        })
      )
    )
  );

  deleteTaskFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskApiActions.deleteTaskFailure),
      map(action =>
        NotificationActions.showError({
          title: 'Deletion Failed',
          message: action.error,
          persistent: true
        })
      )
    )
  );
}
