import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'PrismaFi — See your money clearly',
    loadComponent: () => import('./features/landing/landing').then((m) => m.Landing),
  },
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
