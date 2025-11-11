import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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
export class Blog {
  private blogService = inject(BlogService);
  private analytics = inject(AnalyticsService);

  allPosts = signal<BlogPost[]>([]);
  filteredPosts = signal<BlogPost[]>([]);
  selectedCategory = signal<BlogCategory | 'all'>('all');
  categories = signal<BlogCategory[]>([]);

  constructor() {
    this.allPosts.set(this.blogService.getAllPosts());
    this.filteredPosts.set(this.allPosts());
    this.categories.set(this.blogService.getAllCategories());
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
