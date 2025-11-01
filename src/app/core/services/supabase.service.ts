import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export interface GuideDownload {
  id?: string;
  email: string;
  created_at?: string;
  source_page?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  private platformId = inject(PLATFORM_ID);

  constructor() {
    // Solo inicializar Supabase en el navegador, no en el servidor
    if (isPlatformBrowser(this.platformId)) {
      this.supabase = createClient(
        environment.supabase.url,
        environment.supabase.anonKey,
        {
          auth: {
            persistSession: false, // No persistir sesión (no necesitamos auth)
            autoRefreshToken: false, // No auto-refrescar tokens
            detectSessionInUrl: false // No detectar sesión en URL
          }
        }
      );
    }
  }

  /**
   * Guarda un email en la tabla guide_downloads
   */
  async saveGuideDownload(email: string, sourcePage: string = 'descarga-guia'): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      console.error('Supabase no está disponible (ejecutando en servidor)');
      return { success: false, error: 'Servicio no disponible en el servidor' };
    }

    try {
      const { data, error } = await this.supabase
        .from('guide_downloads')
        .insert([
          {
            email,
            source_page: sourcePage
          }
        ])
        .select();

      if (error) {
        console.error('Error guardando email:', error);
        return { success: false, error: error.message };
      }

      console.log('Email guardado exitosamente:', data);
      return { success: true };
    } catch (error: any) {
      console.error('Error inesperado:', error);
      return { success: false, error: error.message || 'Error desconocido' };
    }
  }

  /**
   * Obtiene todos los registros de guide_downloads (requiere autenticación)
   */
  async getAllGuideDownloads(): Promise<GuideDownload[]> {
    if (!this.supabase) {
      console.error('Supabase no está disponible (ejecutando en servidor)');
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('guide_downloads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error obteniendo registros:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error inesperado:', error);
      return [];
    }
  }

  /**
   * Verifica si un email ya está registrado
   */
  async checkEmailExists(email: string): Promise<boolean> {
    if (!this.supabase) {
      console.error('Supabase no está disponible (ejecutando en servidor)');
      return false;
    }

    try {
      const { data, error } = await this.supabase
        .from('guide_downloads')
        .select('email')
        .eq('email', email)
        .limit(1);

      if (error) {
        console.error('Error verificando email:', error);
        return false;
      }

      return (data && data.length > 0);
    } catch (error) {
      console.error('Error inesperado:', error);
      return false;
    }
  }
}
