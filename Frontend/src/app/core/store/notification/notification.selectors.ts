import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationState } from './notification.reducer';

export const selectNotificationState =
  createFeatureSelector<NotificationState>('notification');

export const selectAllNotifications = createSelector(
  selectNotificationState,
  (state: NotificationState) => state.messages
);

export const selectNotificationCount = createSelector(
  selectAllNotifications,
  (messages) => messages.length
);
