import { createAction, props } from '@ngrx/store';
import { NotificationMessage } from './notification.model';

// Actions for managing notification state
export const showNotification = createAction(
  '[Notification] Show Notification',
  props<{ notification: Omit<NotificationMessage, 'id'> }>()
);

export const addNotification = createAction(
  '[Notification] Add Notification',
  props<{ notification: NotificationMessage }>()
);

export const removeNotification = createAction(
  '[Notification] Remove Notification',
  props<{ id: string }>()
);

export const clearAllNotifications = createAction(
  '[Notification] Clear All Notifications'
);

// Convenience actions for different notification types
export const showSuccess = createAction(
  '[Notification] Show Success',
  props<{ title: string; message?: string; duration?: number }>()
);

export const showError = createAction(
  '[Notification] Show Error',
  props<{ title: string; message?: string; persistent?: boolean }>()
);

export const showWarning = createAction(
  '[Notification] Show Warning',
  props<{ title: string; message?: string; duration?: number }>()
);

export const showInfo = createAction(
  '[Notification] Show Info',
  props<{ title: string; message?: string; duration?: number }>()
);
