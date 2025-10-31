import { Routes } from '@angular/router';
import { authGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/containers/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tasks/containers/tasks-container/tasks-container.component')
      .then(m => m.TasksContainerComponent)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
