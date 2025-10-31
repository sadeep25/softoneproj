import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import * as NotificationActions from './notification.actions';

@Injectable()
export class NotificationEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Handle convenience actions (showSuccess, showError, etc.)
  showSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.showSuccess),
      map(({ title, message, duration }) =>
        NotificationActions.showNotification({
          notification: {
            type: 'success',
            title,
            message,
            duration: duration ?? 5000
          }
        })
      )
    )
  );

  showError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.showError),
      map(({ title, message, persistent, duration }) =>
        NotificationActions.showNotification({
          notification: {
            type: 'error',
            title,
            message,
            persistent: persistent ?? false,
            duration: duration ?? 5000
          }
        })
      )
    )
  );

  showWarning$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.showWarning),
      map(({ title, message, duration }) =>
        NotificationActions.showNotification({
          notification: {
            type: 'warning',
            title,
            message,
            duration: duration ?? 5000
          }
        })
      )
    )
  );

  showInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.showInfo),
      map(({ title, message, duration }) =>
        NotificationActions.showNotification({
          notification: {
            type: 'info',
            title,
            message,
            duration: duration ?? 5000
          }
        })
      )
    )
  );

  // Add notification to store with generated ID
  showNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.showNotification),
      map(({ notification }) => {
        const id = this.generateId();
        return NotificationActions.addNotification({
          notification: {
            ...notification,
            id
          }
        });
      })
    )
  );

  // Auto-remove notifications after duration
  autoRemoveNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NotificationActions.addNotification),
        tap(({ notification }) => {
          if (!notification.persistent && notification.duration && notification.duration > 0) {
            setTimeout(() => {
              this.store.dispatch(
                NotificationActions.removeNotification({ id: notification.id })
              );
            }, notification.duration);
          }
        })
      ),
    { dispatch: false }
  );
}
