import { Injectable } from '@angular/core';
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
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  /**
   * Guarda un email en la tabla guide_downloads
   */
  async saveGuideDownload(email: string, sourcePage: string = 'descarga-guia'): Promise<{ success: boolean; error?: string }> {
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
