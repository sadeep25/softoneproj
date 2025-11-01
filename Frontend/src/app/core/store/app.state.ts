import { LoadingState } from './loading/loading.reducer';
import { NotificationState } from './notification/notification.reducer';

export interface AppState {
  loading: LoadingState;
  notification: NotificationState;
}
