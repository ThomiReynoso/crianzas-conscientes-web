import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../core/services/blog.service';
import { BlogPost } from '../../core/models/blog-post.interface';
import { AnalyticsService } from '../../core/services/analytics.service';
import { MarkdownPipe } from '../../shared/pipes/markdown.pipe';

@Component({
  selector: 'app-blog-post',
  imports: [RouterLink, CommonModule, MarkdownPipe],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.scss',
})
export class BlogPostComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private blogService = inject(BlogService);
  private analytics = inject(AnalyticsService);

  post = signal<BlogPost | undefined>(undefined);
  relatedPosts = signal<BlogPost[]>([]);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      const foundPost = this.blogService.getPostBySlug(slug);

      if (foundPost) {
        this.post.set(foundPost);
        this.loadRelatedPosts(foundPost);
        this.trackPostView(foundPost);
        // Scroll to top when post loads
        window.scrollTo(0, 0);
      } else {
        // Redirect to blog if post not found
        this.router.navigate(['/blog']);
      }
    });
  }

  private loadRelatedPosts(currentPost: BlogPost) {
    const related = this.blogService
      .getPostsByCategory(currentPost.category)
      .filter(p => p.id !== currentPost.id)
      .slice(0, 3);

    this.relatedPosts.set(related);
  }

  private trackPostView(post: BlogPost) {
    this.analytics.trackEvent('blog_post_view', {
      post_title: post.title,
      post_slug: post.slug,
      post_category: post.category
    });
  }

  onRelatedPostClick(post: BlogPost) {
    this.analytics.trackEvent('related_post_click', {
      from_post: this.post()?.slug,
      to_post: post.slug
    });
  }

  onDownloadGuideClick() {
    this.analytics.trackCtaClick('Descargar guía desde blog', 'blog_post', '/descarga-guia');
  }

  onContactClick() {
    this.analytics.trackCtaClick('Contacto desde blog', 'blog_post', '/contacto');
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
}
