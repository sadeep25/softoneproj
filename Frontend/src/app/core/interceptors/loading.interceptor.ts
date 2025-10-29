import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Create operation identifier
  const operation = `${req.method} ${req.url}`;
  
  // Start loading
  loadingService.setLoading(true, operation);

  return next(req).pipe(
    finalize(() => {
      // Stop loading
      loadingService.setLoading(false, operation);
    })
  );
};