import { Injectable, signal, inject } from '@angular/core';
import { BlogPost, BlogCategory } from '../models/blog-post.interface';
import { SupabaseService, BlogPost as SupabaseBlogPost } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private supabaseService = inject(SupabaseService);
  private posts = signal<BlogPost[]>([]);
  private isLoadedFromSupabase = signal<boolean>(false);

  constructor() {
    this.loadPostsFromSupabase();
  }

  /**
   * Carga posts desde Supabase
   */
  private async loadPostsFromSupabase() {
    try {
      const supabasePosts = await this.supabaseService.getAllPublishedBlogPosts();
      if (supabasePosts && supabasePosts.length > 0) {
        // Convertir posts de Supabase al formato del frontend
        const convertedPosts = supabasePosts.map(post => this.convertSupabasePostToFrontend(post));
        this.posts.set(convertedPosts);
        this.isLoadedFromSupabase.set(true);
      } else {
        // Si no hay posts en Supabase, usar los datos iniciales como fallback
        console.warn('No se encontraron posts en Supabase, usando datos locales como fallback');
        this.posts.set([]);
      }
    } catch (error) {
      console.error('Error cargando posts desde Supabase:', error);
      // En caso de error, usar datos locales como fallback
      this.posts.set([]);
    }
  }

  /**
   * Convierte un post de Supabase al formato del frontend
   */
  private convertSupabasePostToFrontend(supabasePost: SupabaseBlogPost): BlogPost {
    return {
      id: supabasePost.id || '',
      slug: supabasePost.slug,
      title: supabasePost.title,
      excerpt: supabasePost.excerpt,
      content: supabasePost.content,
      author: supabasePost.author,
      publishedDate: new Date(supabasePost.published_date),
      updatedDate: supabasePost.updated_date ? new Date(supabasePost.updated_date) : undefined,
      imageUrl: supabasePost.image_url || '',
      category: supabasePost.category as BlogCategory,
      tags: supabasePost.tags || [],
      readingTime: supabasePost.reading_time,
      featured: supabasePost.featured
    };
  }

  /**
   * Recarga los posts desde Supabase
   */
  async reloadPosts(): Promise<void> {
    await this.loadPostsFromSupabase();
  }

  // Get all posts
  getAllPosts(): BlogPost[] {
    return this.posts();
  }

  // Get featured posts
  getFeaturedPosts(): BlogPost[] {
    return this.posts().filter(post => post.featured);
  }

  // Get post by slug
  getPostBySlug(slug: string): BlogPost | undefined {
    return this.posts().find(post => post.slug === slug);
  }

  // Get posts by category
  getPostsByCategory(category: BlogCategory): BlogPost[] {
    return this.posts().filter(post => post.category === category);
  }

  // Get posts by tag
  getPostsByTag(tag: string): BlogPost[] {
    return this.posts().filter(post =>
      post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  // Get recent posts
  getRecentPosts(limit: number = 3): BlogPost[] {
    return this.posts()
      .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime())
      .slice(0, limit);
  }

  // Get all categories
  getAllCategories(): BlogCategory[] {
    return Object.values(BlogCategory);
  }

  // Get all unique tags
  getAllTags(): string[] {
    const tags = new Set<string>();
    this.posts().forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }
}
