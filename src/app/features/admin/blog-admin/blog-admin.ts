import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService, BlogPost } from '../../../core/services/supabase.service';
import { BlogCategory } from '../../../core/models/blog-post.interface';

@Component({
  selector: 'app-blog-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './blog-admin.html',
  styles: []
})
export class BlogAdminComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  posts = signal<BlogPost[]>([]);
  filteredPosts = signal<BlogPost[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string>('');
  showForm = signal<boolean>(false);
  editingPost = signal<BlogPost | null>(null);
  searchTerm = signal<string>('');
  filterCategory = signal<string>('all');

  // Formulario
  formData = signal<Partial<BlogPost>>({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    author: 'Mailen Steinbrenner',
    published_date: new Date().toISOString().split('T')[0],
    image_url: '',
    category: 'Crianza Consciente',
    tags: [],
    reading_time: 5,
    featured: false,
    is_published: true
  });

  tagInput = signal<string>('');
  uploadingImage = signal<boolean>(false);
  categories = Object.values(BlogCategory);

  async ngOnInit() {
    await this.loadPosts();
  }

  /**
   * Carga todos los posts
   */
  async loadPosts() {
    this.isLoading.set(true);
    this.error.set('');
    try {
      const posts = await this.supabaseService.getAllBlogPosts();
      this.posts.set(posts);
      this.applyFilters();
    } catch (error: any) {
      console.error('Error cargando posts:', error);
      this.error.set('Error al cargar los posts. Por favor, intenta de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Aplica filtros de búsqueda y categoría
   */
  applyFilters() {
    let filtered = this.posts();

    // Filtrar por búsqueda
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(search) ||
        post.excerpt.toLowerCase().includes(search) ||
        post.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Filtrar por categoría
    if (this.filterCategory() !== 'all') {
      filtered = filtered.filter(post => post.category === this.filterCategory());
    }

    this.filteredPosts.set(filtered);
  }

  /**
   * Abre el formulario para crear un nuevo post
   */
  openCreateForm() {
    this.editingPost.set(null);
    this.formData.set({
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      author: 'Mailen Steinbrenner',
      published_date: new Date().toISOString().split('T')[0],
      image_url: '',
      category: 'Crianza Consciente',
      tags: [],
      reading_time: 5,
      featured: false,
      is_published: true
    });
    this.showForm.set(true);
  }

  /**
   * Abre el formulario para editar un post
   */
  openEditForm(post: BlogPost) {
    this.editingPost.set(post);
    this.formData.set({
      ...post,
      published_date: post.published_date.split('T')[0] // Formato YYYY-MM-DD
    });
    this.showForm.set(true);
  }

  /**
   * Cierra el formulario
   */
  closeForm() {
    this.showForm.set(false);
    this.editingPost.set(null);
    this.error.set('');
  }

  /**
   * Genera slug desde el título
   */
  generateSlug() {
    const title = this.formData().title || '';
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
      .trim()
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-'); // Eliminar guiones duplicados

    this.formData.update(data => ({ ...data, slug }));
  }

  /**
   * Agrega un tag
   */
  addTag() {
    const tag = this.tagInput().trim();
    if (tag && !this.formData().tags?.includes(tag)) {
      this.formData.update(data => ({
        ...data,
        tags: [...(data.tags || []), tag]
      }));
      this.tagInput.set('');
    }
  }

  /**
   * Elimina un tag
   */
  removeTag(tag: string) {
    this.formData.update(data => ({
      ...data,
      tags: (data.tags || []).filter(t => t !== tag)
    }));
  }

  /**
   * Maneja la subida de imagen
   */
  async onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.error.set('Por favor, selecciona un archivo de imagen válido.');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.error.set('La imagen no puede superar los 5MB.');
      return;
    }

    this.uploadingImage.set(true);
    this.error.set('');

    try {
      const result = await this.supabaseService.uploadBlogImage(file, 'posts');
      if (result.success && result.url) {
        this.formData.update(data => ({ ...data, image_url: result.url }));
      } else {
        this.error.set(result.error || 'Error al subir la imagen.');
      }
    } catch (error: any) {
      console.error('Error subiendo imagen:', error);
      this.error.set('Error al subir la imagen. Por favor, intenta de nuevo.');
    } finally {
      this.uploadingImage.set(false);
    }
  }

  /**
   * Guarda el post (crear o actualizar)
   */
  async savePost() {
    // Validación
    const data = this.formData();
    if (!data.title || !data.slug || !data.excerpt || !data.content) {
      this.error.set('Por favor, completa todos los campos requeridos.');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    try {
      const postData: any = {
        ...data,
        published_date: data.published_date || new Date().toISOString()
      };

      if (this.editingPost()) {
        // Actualizar post existente
        const result = await this.supabaseService.updateBlogPost(this.editingPost()!.id!, postData);
        if (result.success) {
          await this.loadPosts();
          this.closeForm();
        } else {
          this.error.set(result.error || 'Error al actualizar el post.');
        }
      } else {
        // Crear nuevo post
        const result = await this.supabaseService.createBlogPost(postData);
        if (result.success) {
          await this.loadPosts();
          this.closeForm();
        } else {
          this.error.set(result.error || 'Error al crear el post.');
        }
      }
    } catch (error: any) {
      console.error('Error guardando post:', error);
      this.error.set('Error al guardar el post. Por favor, intenta de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Elimina un post
   */
  async deletePost(post: BlogPost) {
    if (!confirm(`¿Estás seguro de que quieres eliminar el post "${post.title}"?`)) {
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    try {
      const result = await this.supabaseService.deleteBlogPost(post.id!);
      if (result.success) {
        await this.loadPosts();
      } else {
        this.error.set(result.error || 'Error al eliminar el post.');
      }
    } catch (error: any) {
      console.error('Error eliminando post:', error);
      this.error.set('Error al eliminar el post. Por favor, intenta de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Cierra sesión
   */
  async logout() {
    await this.supabaseService.signOut();
    this.router.navigate(['/admin/login']);
  }

  /**
   * Formatea la fecha
   */
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Navega al blog público
   */
  viewPost(slug: string) {
    window.open(`/blog/${slug}`, '_blank');
  }
}
