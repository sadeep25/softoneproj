import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, mergeMap, concatMap, tap, withLatestFrom } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import { NotificationService } from '../../services/notification.service';
import * as TaskPageActions from './task-page.actions';
import * as TaskApiActions from './task-api.actions';
import { ApiResponse, Task } from '../../models';
import { getFilters } from './task.selectors';

@Injectable()
export class TaskEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private taskService = inject(TaskService);
  private notificationService = inject(NotificationService);

  // Load Tasks Effect
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
          catchError((error: Error) =>
            of(TaskApiActions.loadTasksFailure({
              error: error.message || 'Unknown error occurred'
            }))
          )
        )
      )
    )
  );

  // Reload tasks when filters change
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
          catchError((error: Error) =>
            of(TaskApiActions.createTaskFailure({
              error: error.message || 'Failed to create task'
            }))
          )
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
          catchError((error: Error) =>
            of(TaskApiActions.updateTaskFailure({
              error: error.message || 'Failed to update task'
            }))
          )
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
          catchError((error: Error) =>
            of(TaskApiActions.deleteTaskFailure({
              error: error.message || 'Failed to delete task'
            }))
          )
        )
      )
    )
  );

  // Success Notifications
  createTaskSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TaskApiActions.createTaskSuccess),
        tap(() => {
          this.notificationService.success('Success', 'Task created successfully');
        })
      ),
    { dispatch: false }
  );

  updateTaskSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TaskApiActions.updateTaskSuccess),
        tap(() => {
          this.notificationService.success('Success', 'Task updated successfully');
        })
      ),
    { dispatch: false }
  );

  deleteTaskSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TaskApiActions.deleteTaskSuccess),
        tap(() => {
          this.notificationService.success('Success', 'Task deleted successfully');
        })
      ),
    { dispatch: false }
  );

  // Error Notifications
  loadTasksFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TaskApiActions.loadTasksFailure),
        tap(action => {
          this.notificationService.error('Load Failed', action.error);
        })
      ),
    { dispatch: false }
  );

  createTaskFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TaskApiActions.createTaskFailure),
        tap(action => {
          this.notificationService.error('Creation Failed', action.error);
        })
      ),
    { dispatch: false }
  );

  updateTaskFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TaskApiActions.updateTaskFailure),
        tap(action => {
          this.notificationService.error('Update Failed', action.error);
        })
      ),
    { dispatch: false }
  );

  deleteTaskFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TaskApiActions.deleteTaskFailure),
        tap(action => {
          this.notificationService.error('Deletion Failed', action.error);
        })
      ),
    { dispatch: false }
  );
}
