import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Rutas dinámicas del blog se renderizan en el servidor (SSR)
    // No se pre-renderizan en build time
    path: 'blog/:slug',
    renderMode: RenderMode.Server
  },
  {
    // Rutas del admin se renderizan en el servidor (no pre-renderizar)
    path: 'admin/**',
    renderMode: RenderMode.Server
  },
  {
    // Todas las demás rutas se pre-renderizan en build time
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
