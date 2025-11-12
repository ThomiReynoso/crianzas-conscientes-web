import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {
    // Solo inicializar Supabase en el navegador, no en el servidor
    if (isPlatformBrowser(this.platformId)) {
      this.supabase = createClient(
        environment.supabase.url,
        environment.supabase.anonKey,
        {
          auth: {
            persistSession: true, // Persistir sesión para admin
            autoRefreshToken: true, // Auto-refrescar tokens
            detectSessionInUrl: true // Detectar sesión en URL
          }
        }
      );

      // Escuchar cambios en la autenticación
      this.supabase.auth.onAuthStateChange((event, session) => {
        this.currentUserSubject.next(session?.user ?? null);
      });

      // Obtener sesión actual al iniciar
      this.supabase.auth.getSession().then(({ data: { session } }) => {
        this.currentUserSubject.next(session?.user ?? null);
      });
    }
  }

  // ==================== AUTH METHODS ====================

  /**
   * Inicia sesión con email y contraseña
   */
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      return { success: false, error: 'Servicio no disponible' };
    }

    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error desconocido' };
    }
  }

  /**
   * Cierra la sesión actual
   */
  async signOut(): Promise<void> {
    if (!this.supabase) return;
    await this.supabase.auth.signOut();
    this.currentUserSubject.next(null);
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si hay un usuario autenticado
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
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

  // ==================== ADMIN METHODS ====================

  /**
   * Actualiza un registro de guide_downloads
   */
  async updateGuideDownload(id: string, updates: Partial<GuideDownload>): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      return { success: false, error: 'Servicio no disponible' };
    }

    try {
      const { error } = await this.supabase
        .from('guide_downloads')
        .update(updates)
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error desconocido' };
    }
  }

  /**
   * Elimina un registro de guide_downloads
   */
  async deleteGuideDownload(id: string): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      return { success: false, error: 'Servicio no disponible' };
    }

    try {
      const { error } = await this.supabase
        .from('guide_downloads')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error desconocido' };
    }
  }

  /**
   * Obtiene estadísticas de descargas
   */
  async getDownloadStats(): Promise<{ total: number; bySource: Record<string, number> }> {
    if (!this.supabase) {
      return { total: 0, bySource: {} };
    }

    try {
      const { data, error } = await this.supabase
        .from('guide_downloads')
        .select('source_page');

      if (error || !data) {
        return { total: 0, bySource: {} };
      }

      const bySource: Record<string, number> = {};
      data.forEach((record: any) => {
        const source = record.source_page || 'desconocido';
        bySource[source] = (bySource[source] || 0) + 1;
      });

      return {
        total: data.length,
        bySource
      };
    } catch (error) {
      return { total: 0, bySource: {} };
    }
  }
}
