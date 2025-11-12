import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  if (supabaseService.isAuthenticated()) {
    return true;
  }

  // Redirigir a login si no está autenticado
  router.navigate(['/admin/login']);
  return false;
};
