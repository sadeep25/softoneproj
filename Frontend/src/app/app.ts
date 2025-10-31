import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { NotificationComponent } from './shared/components/notification/notification.component';
import * as AuthSelectors from './core/store/auth/auth.selectors';
import * as AuthPageActions from './core/store/auth/auth-page.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  // Use store signal selectors
  isAuthenticated = this.store.selectSignal(AuthSelectors.getIsAuthenticated);
  userName = this.store.selectSignal(AuthSelectors.getUserName);
  isLoginPage = signal(false);

  ngOnInit(): void {
    // Restore auth state from localStorage on app initialization
    this.store.dispatch(AuthPageActions.init());

    // Track route changes to hide login button on login page
    this.isLoginPage.set(this.router.url === '/login');
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isLoginPage.set(event.urlAfterRedirects === '/login');
      });
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  onLogout(): void {
    this.store.dispatch(AuthPageActions.logout());
  }
}
