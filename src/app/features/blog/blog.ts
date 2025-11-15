import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { BlogService } from '../../core/services/blog.service';
import { BlogPost, BlogCategory } from '../../core/models/blog-post.interface';
import { AnalyticsService } from '../../core/services/analytics.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog',
  imports: [RouterLink, CommonModule],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog implements OnInit {
  private blogService = inject(BlogService);
  private analytics = inject(AnalyticsService);
  private meta = inject(Meta);
  private title = inject(Title);

  allPosts = signal<BlogPost[]>([]);
  filteredPosts = signal<BlogPost[]>([]);
  selectedCategory = signal<BlogCategory | 'all'>('all');
  categories = signal<BlogCategory[]>([]);

  constructor() {
    this.allPosts.set(this.blogService.getAllPosts());
    this.filteredPosts.set(this.allPosts());
    this.categories.set(this.blogService.getAllCategories());
  }

  ngOnInit() {
    this.updateMetaTags();
  }

  /**
   * Actualiza los meta tags para la página del blog
   */
  private updateMetaTags() {
    const url = 'https://www.mailensteinbrenner.com/blog';
    const description = 'Artículos, reflexiones y herramientas prácticas sobre crianza consciente, disciplina positiva y gestión emocional infantil.';
    const imageUrl = 'https://www.mailensteinbrenner.com/logo.png';

    // Título de la página
    this.title.setTitle('Blog de Crianza Consciente | Crianzas Conscientes');

    // Meta description
    this.meta.updateTag({ name: 'description', content: description });

    // Keywords
    this.meta.updateTag({
      name: 'keywords',
      content: 'crianza consciente, disciplina positiva, crianza respetuosa, límites con amor, gestión emocional infantil, maternidad consciente, paternidad consciente'
    });

    // Open Graph tags
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: 'Blog de Crianza Consciente' });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:site_name', content: 'Crianzas Conscientes' });

    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Blog de Crianza Consciente' });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });

    // Canonical URL
    this.meta.updateTag({ rel: 'canonical', href: url });
  }

  filterByCategory(category: BlogCategory | 'all') {
    this.selectedCategory.set(category);
    if (category === 'all') {
      this.filteredPosts.set(this.allPosts());
    } else {
      this.filteredPosts.set(this.blogService.getPostsByCategory(category));
    }
    this.analytics.trackEvent('blog_filter', { category });
  }

  onPostClick(post: BlogPost) {
    this.analytics.trackEvent('blog_post_click', {
      post_title: post.title,
      post_slug: post.slug,
      post_category: post.category
    });
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
}
