import { createReducer, on } from '@ngrx/store';
import { NotificationMessage } from './notification.model';
import * as NotificationActions from './notification.actions';

export interface NotificationState {
  messages: NotificationMessage[];
}

export const initialState: NotificationState = {
  messages: []
};

export const notificationReducer = createReducer(
  initialState,
  on(NotificationActions.addNotification, (state, { notification }) => ({
    ...state,
    messages: [...state.messages, notification]
  })),
  on(NotificationActions.removeNotification, (state, { id }) => ({
    ...state,
    messages: state.messages.filter(m => m.id !== id)
  })),
  on(NotificationActions.clearAllNotifications, (state) => ({
    ...state,
    messages: []
  }))
);
