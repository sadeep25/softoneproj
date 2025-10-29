import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    loadComponent: () => import('./features/tasks/containers/tasks-container/tasks-container.component')
      .then(m => m.TasksContainerComponent)
  },
  {
    path: '**',
    redirectTo: '/tasks'
  }
];
