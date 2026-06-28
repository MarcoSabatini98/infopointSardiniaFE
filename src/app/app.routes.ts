import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Dashboard — infopoint Sardegna',
  },
  {
    path: 'meteo',
    loadComponent: () => import('./features/weather/weather-page').then((m) => m.WeatherPage),
    title: 'Meteo — infopoint Sardegna',
  },
  {
    path: 'incendi',
    loadComponent: () => import('./features/fires/fires-page').then((m) => m.FiresPage),
    title: 'Incendi — infopoint Sardegna',
  },
  {
    path: 'traffico',
    loadComponent: () => import('./features/traffic/traffic-page').then((m) => m.TrafficPage),
    title: 'Traffico — infopoint Sardegna',
  },
  {
    path: 'voli',
    loadComponent: () => import('./features/flights/flights-page').then((m) => m.FlightsPage),
    title: 'Voli — infopoint Sardegna',
  },
  {
    path: 'navi',
    loadComponent: () => import('./features/vessels/vessels-page').then((m) => m.VesselsPage),
    title: 'Navi — infopoint Sardegna',
  },
  {
    path: 'news',
    loadComponent: () => import('./features/news/news-page').then((m) => m.NewsPage),
    title: 'News — infopoint Sardegna',
  },
  {
    path: 'eventi',
    loadComponent: () => import('./features/events/events-list').then((m) => m.EventsList),
    title: 'Eventi — infopoint Sardegna',
  },
  {
    path: 'eventi/:id',
    loadComponent: () => import('./features/events/event-detail').then((m) => m.EventDetail),
    title: 'Evento — infopoint Sardegna',
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
  {
    path: 'impostazioni',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/settings-admin').then((m) => m.SettingsAdmin),
    title: 'Impostazioni — infopoint Sardegna',
  },
  { path: '**', redirectTo: '' },
];
