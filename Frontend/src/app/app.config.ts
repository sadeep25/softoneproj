import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { taskReducer } from './core/store/task/task.reducer';
import { TaskEffects } from './core/store/task/task.effects';
import { authReducer } from './core/store/auth/auth.reducer';
import { AuthEffects } from './core/store/auth/auth.effects';
import { loadingReducer } from './core/store/loading/loading.reducer';
import { notificationReducer } from './core/store/notification/notification.reducer';
import { NotificationEffects } from './core/store/notification/notification.effects';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor,
        loadingInterceptor
      ])
    ),
    // NgRx Store configuration
    provideStore({
      tasks: taskReducer,
      auth: authReducer,
      loading: loadingReducer,
      notification: notificationReducer
    }),
    provideEffects([TaskEffects, AuthEffects, NotificationEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
      name: 'Task Manager App DevTools'
    })
  ]
};
