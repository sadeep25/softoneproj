import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';
import * as LoadingActions from '../store/loading/loading.actions';
import * as NotificationActions from '../store/notification/notification.actions';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Clear all loading operations
      store.dispatch(LoadingActions.clearAllLoading());

      let errorMessage = 'An unexpected error occurred';
      let errorTitle = 'Error';
      const isAuthEndpoint = req.url.includes('/auth/login');

      // Try to get message from API response first
      if (error.error?.message) {
        errorMessage = error.error.message;
      }

      // Provide user-friendly messages based on status code
      switch (error.status) {
        case 400:
          errorTitle = 'Invalid Request';
          if (!error.error?.message) {
            errorMessage = 'The request contains invalid data. Please check and try again';
          }
          break;
        case 401:
          if (isAuthEndpoint) {
            errorTitle = 'Login Failed';
            errorMessage = 'Invalid username or password. Please try again';
          } else {
            errorTitle = 'Session Expired';
            errorMessage = 'Your session has expired. Please log in again';
          }
          break;
        case 403:
          errorTitle = 'Access Denied';
          errorMessage = 'You do not have permission to perform this action';
          break;
        case 404:
          errorTitle = 'Not Found';
          errorMessage = 'The requested resource could not be found';
          break;
        case 500:
          errorTitle = 'Server Error';
          errorMessage = 'An error occurred on the server. Please try again later';
          break;
        case 503:
          errorTitle = 'Service Unavailable';
          errorMessage = 'The service is temporarily unavailable. Please try again later';
          break;
        case 0:
          errorTitle = 'Connection Failed';
          errorMessage = 'Unable to connect to the server. Please check if the server is running';
          break;
        default:
          if (error.status >= 500) {
            errorTitle = 'Server Error';
            errorMessage = 'A server error occurred. Please try again later';
          }
      }

      // Show notification for non-auth endpoints
      if (!isAuthEndpoint) {
        store.dispatch(
          NotificationActions.showError({
            title: errorTitle,
            message: errorMessage
          })
        );
      }

      return throwError(() => error);
    })
  );
};
