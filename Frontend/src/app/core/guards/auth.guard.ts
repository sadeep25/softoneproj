import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { getIsAuthenticated } from '../store/auth/auth.selectors';

/**
 * Auth Guard - Uses NgRx store as source of truth
 * No service dependency, all state from store
 */
export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(getIsAuthenticated).pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }

      // Redirect to login page if not authenticated
      router.navigate(['/login']);
      return false;
    })
  );
};
