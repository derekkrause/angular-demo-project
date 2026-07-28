import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    loadComponent: () => import('@features/dashboard/dashboard'),
  },
  {
    path: 'reports',
    title: 'Reports',
    loadComponent: () => import('@features/reports/reports'),
  },
  {
    path: 'not-found',
    pathMatch: 'full',
    title: 'Not Found',
    loadComponent: () => import('@features/not-found/not-found'),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
