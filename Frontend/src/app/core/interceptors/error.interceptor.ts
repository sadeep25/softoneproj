import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { LoadingService } from '../services/loading.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const loadingService = inject(LoadingService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      loadingService.clearAll();

      let errorMessage = 'An unexpected error occurred';
      let errorTitle = 'Error';

      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      switch (error.status) {
        case 400:
          errorTitle = 'Bad Request';
          break;
        case 401:
          errorTitle = 'Unauthorized';
          errorMessage = 'Please log in to continue';
          break;
        case 403:
          errorTitle = 'Forbidden';
          errorMessage = 'You do not have permission to perform this action';
          break;
        case 404:
          errorTitle = 'Not Found';
          errorMessage = 'The requested resource was not found';
          break;
        case 500:
          errorTitle = 'Server Error';
          errorMessage = 'Internal server error. Please try again later';
          break;
        case 0:
          errorTitle = 'Network Error';
          errorMessage = 'Unable to connect to the server. Please check your internet connection';
          break;
      }

      // Show notification for non-auth endpoints
      if (!req.url.includes('/auth/')) {
        notificationService.error(errorTitle, errorMessage);
      }

      return throwError(() => error);
    })
  );
};