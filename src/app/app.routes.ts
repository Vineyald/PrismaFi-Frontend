import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then((m) => m.Home) },
  {
    path: 'login',
    title: 'Sign in · PrismaFi',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    title: 'Create account · PrismaFi',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  { path: '**', redirectTo: '' },
];
