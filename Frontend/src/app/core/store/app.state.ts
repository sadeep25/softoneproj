import { LoadingState } from './loading/loading.reducer';
import { NotificationState } from './notification/notification.reducer';

// Root application state
export interface AppState {
  loading: LoadingState;
  notification: NotificationState;
}
