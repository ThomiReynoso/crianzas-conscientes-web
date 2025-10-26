import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home)
  },
  {
    path: 'quien-soy',
    loadComponent: () => import('./features/about/about').then(m => m.About)
  },
  {
    path: 'que-es-crianza-consciente',
    loadComponent: () => import('./features/what-is/what-is').then(m => m.WhatIs)
  },
  {
    path: 'servicios',
    loadComponent: () => import('./features/services/services').then(m => m.Services)
  },
  {
    path: 'contacto',
    loadComponent: () => import('./features/contact/contact').then(m => m.Contact)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
