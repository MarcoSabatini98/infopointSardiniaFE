import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Dashboard — infopoint Sardegna',
  },
  {
    path: 'eventi',
    loadComponent: () => import('./features/events/events-list').then((m) => m.EventsList),
    title: 'Eventi — infopoint Sardegna',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
    title: 'Accedi — infopoint Sardegna',
  },
  {
    path: 'gestione',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/events-admin').then((m) => m.EventsAdmin),
    title: 'Gestione eventi — infopoint Sardegna',
  },
  { path: '**', redirectTo: '' },
];
