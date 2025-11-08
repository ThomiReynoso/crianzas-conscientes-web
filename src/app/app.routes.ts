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
    path: 'descarga-guia',
    loadComponent: () => import('./features/download-guide/download-guide').then(m => m.DownloadGuideComponent)
  },
  {
    path: 'recursos-digitales',
    loadComponent: () => import('./features/recursos-digitales/recursos-digitales').then(m => m.RecursosDigitalesComponent)
  },
  {
    path: 'politica-privacidad',
    loadComponent: () => import('./features/privacy-policy/privacy-policy').then(m => m.PrivacyPolicyComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
