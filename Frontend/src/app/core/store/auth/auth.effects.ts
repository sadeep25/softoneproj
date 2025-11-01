import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { AuthService } from '../../../features/auth/services/auth.service';
import * as AuthPageActions from './auth-page.actions';
import * as AuthApiActions from './auth-api.actions';
import * as NotificationActions from '../notification/notification.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthPageActions.init),
      map(() => {
        const userJson = localStorage.getItem('currentUser');
        const token = localStorage.getItem('token');

        if (userJson && token) {
          try {
            const user = JSON.parse(userJson);
            return AuthApiActions.initSuccess({ user, token });
          } catch (error) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
            return AuthApiActions.initFailure();
          }
        }
        return AuthApiActions.initFailure();
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthPageActions.login),
      exhaustMap(action =>
        this.authService.login(action.credentials).pipe(
          map(response => {
            if (response.success && response.data.success) {
              return AuthApiActions.loginSuccess({ response });
            } else {
              return AuthApiActions.loginFailure({
                error: response.message || 'Login failed'
              });
            }
          }),
          catchError((error: any) => {
            let errorMessage = 'An error occurred during login';

            if (error.status === 401) {
              errorMessage = 'Invalid username or password. Please try again';
            } else if (error.status === 0) {
              errorMessage = 'Unable to connect to the server. Please check if the server is running';
            } else if (error.status === 500) {
              errorMessage = 'Server error occurred. Please try again later';
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            }

            return of(AuthApiActions.loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  persistAuthOnLoginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthApiActions.loginSuccess),
        tap(action => {
          const { response } = action;
          if (response.data.user) {
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));
          }
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
          }
        })
      ),
    { dispatch: false }
  );

  navigateOnLoginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthApiActions.loginSuccess),
        tap(() => {
          this.router.navigate(['/tasks']);
        }),
        map(() =>
          NotificationActions.showSuccess({
            title: 'Success',
            message: 'Login successful'
          })
        )
      )
  );

  loginFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthApiActions.loginFailure),
      map(action =>
        NotificationActions.showError({
          title: 'Login Failed',
          message: action.error
        })
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthPageActions.logout),
      tap(() => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
      }),
      map(() => AuthApiActions.logoutSuccess())
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthApiActions.logoutSuccess),
        tap(() => {
          this.router.navigate(['/login']);
        }),
        map(() =>
          NotificationActions.showSuccess({
            title: 'Success',
            message: 'Logged out successfully'
          })
        )
      )
  );

  initFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthApiActions.initFailure),
        tap(() => {
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
