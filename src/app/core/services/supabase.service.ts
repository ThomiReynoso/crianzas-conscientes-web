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

export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_date: string;
  updated_date?: string;
  image_url?: string;
  category: string;
  tags: string[];
  reading_time: number;
  featured: boolean;
  is_published: boolean;
  created_at?: string;
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
            detectSessionInUrl: true, // Detectar sesión en URL
            // Aumentar el timeout del lock para evitar errores de concurrencia
            lock: {
              acquireTimeout: 10000 // 10 segundos en lugar del default
            }
          },
          db: {
            schema: 'public'
          },
          global: {
            headers: {
              'x-client-info': 'crianzas-conscientes-web'
            }
          }
        }
      );

      // Escuchar cambios en la autenticación
      this.supabase.auth.onAuthStateChange((event, session) => {
        this.currentUserSubject.next(session?.user ?? null);
      });

      // Obtener sesión actual al iniciar (con manejo de errores)
      this.supabase.auth.getSession()
        .then(({ data: { session } }) => {
          this.currentUserSubject.next(session?.user ?? null);
        })
        .catch((error) => {
          console.warn('Error obteniendo sesión inicial:', error);
          this.currentUserSubject.next(null);
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

  // ==================== BLOG POSTS METHODS ====================

  /**
   * Obtiene todos los posts del blog (publicados)
   */
  async getAllPublishedBlogPosts(): Promise<BlogPost[]> {
    if (!this.supabase) {
      // No es un error, simplemente estamos en el servidor
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_date', { ascending: false });

      if (error) {
        // Solo mostrar error si es algo diferente a "no existe la tabla" (cuando aún no se ha configurado)
        if (!error.message.includes('relation "public.blog_posts" does not exist')) {
          console.error('Error obteniendo posts:', error);
        }
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error inesperado obteniendo posts:', error);
      return [];
    }
  }

  /**
   * Obtiene todos los posts (incluye borradores) - Solo para admin
   */
  async getAllBlogPosts(): Promise<BlogPost[]> {
    if (!this.supabase) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Solo mostrar error si es algo diferente a "no existe la tabla"
        if (!error.message.includes('relation "public.blog_posts" does not exist')) {
          console.error('Error obteniendo posts (admin):', error);
        }
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error inesperado obteniendo posts (admin):', error);
      return [];
    }
  }

  /**
   * Obtiene un post por su slug
   */
  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    if (!this.supabase) {
      return null;
    }

    try {
      const { data, error } = await this.supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        // Solo mostrar error si no es "not found" o "no existe la tabla"
        if (!error.message.includes('relation "public.blog_posts" does not exist') &&
            error.code !== 'PGRST116') { // PGRST116 es el código de "no rows returned"
          console.error('Error obteniendo post por slug:', error);
        }
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error inesperado obteniendo post por slug:', error);
      return null;
    }
  }

  /**
   * Crea un nuevo post
   */
  async createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_date'>): Promise<{ success: boolean; error?: string; data?: BlogPost }> {
    if (!this.supabase) {
      return { success: false, error: 'Servicio no disponible' };
    }

    try {
      const { data, error } = await this.supabase
        .from('blog_posts')
        .insert([post])
        .select()
        .single();

      if (error) {
        console.error('Error creando post:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error: any) {
      console.error('Error inesperado:', error);
      return { success: false, error: error.message || 'Error desconocido' };
    }
  }

  /**
   * Actualiza un post existente
   */
  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      return { success: false, error: 'Servicio no disponible' };
    }

    try {
      const { error } = await this.supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error actualizando post:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error inesperado:', error);
      return { success: false, error: error.message || 'Error desconocido' };
    }
  }

  /**
   * Elimina un post
   */
  async deleteBlogPost(id: string): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      return { success: false, error: 'Servicio no disponible' };
    }

    try {
      const { error } = await this.supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error eliminando post:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error inesperado:', error);
      return { success: false, error: error.message || 'Error desconocido' };
    }
  }

  /**
   * Obtiene posts por categoría
   */
  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    if (!this.supabase) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('blog_posts')
        .select('*')
        .eq('category', category)
        .eq('is_published', true)
        .order('published_date', { ascending: false });

      if (error) {
        console.error('Error obteniendo posts por categoría:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error inesperado:', error);
      return [];
    }
  }

  /**
   * Obtiene posts destacados
   */
  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    if (!this.supabase) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('blog_posts')
        .select('*')
        .eq('featured', true)
        .eq('is_published', true)
        .order('published_date', { ascending: false });

      if (error) {
        console.error('Error obteniendo posts destacados:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error inesperado:', error);
      return [];
    }
  }

  // ==================== STORAGE METHODS ====================

  /**
   * Sube una imagen al bucket de blog
   */
  async uploadBlogImage(file: File, folder: string = 'posts'): Promise<{ success: boolean; error?: string; url?: string }> {
    if (!this.supabase) {
      return { success: false, error: 'Servicio no disponible' };
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await this.supabase.storage
        .from('blog-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error subiendo imagen:', error);
        return { success: false, error: error.message };
      }

      // Obtener URL pública
      const { data: { publicUrl } } = this.supabase.storage
        .from('blog-images')
        .getPublicUrl(data.path);

      return { success: true, url: publicUrl };
    } catch (error: any) {
      console.error('Error inesperado:', error);
      return { success: false, error: error.message || 'Error desconocido' };
    }
  }

  /**
   * Elimina una imagen del storage
   */
  async deleteBlogImage(imageUrl: string): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      return { success: false, error: 'Servicio no disponible' };
    }

    try {
      // Extraer el path de la URL
      const path = imageUrl.split('/storage/v1/object/public/blog-images/')[1];
      if (!path) {
        return { success: false, error: 'URL inválida' };
      }

      const { error } = await this.supabase.storage
        .from('blog-images')
        .remove([path]);

      if (error) {
        console.error('Error eliminando imagen:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error inesperado:', error);
      return { success: false, error: error.message || 'Error desconocido' };
    }
  }
}
