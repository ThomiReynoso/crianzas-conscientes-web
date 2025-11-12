import { Component, inject, signal, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
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
  private meta = inject(Meta);
  private title = inject(Title);
  private platformId = inject(PLATFORM_ID);
  @Inject(DOCUMENT) private document!: Document;

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
        this.updateMetaTags(foundPost);
        this.addStructuredData(foundPost);
        // Scroll to top when post loads
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0);
        }
      } else {
        // Redirect to blog if post not found
        this.router.navigate(['/blog']);
      }
    });
  }

  /**
   * Actualiza los meta tags para SEO
   */
  private updateMetaTags(post: BlogPost) {
    const url = `https://www.mailensteinbrenner.com/blog/${post.slug}`;
    const imageUrl = post.imageUrl.startsWith('http')
      ? post.imageUrl
      : `https://www.mailensteinbrenner.com${post.imageUrl}`;

    // Título de la página
    this.title.setTitle(`${post.title} | Crianzas Conscientes`);

    // Meta description
    this.meta.updateTag({ name: 'description', content: post.excerpt });

    // Keywords
    this.meta.updateTag({ name: 'keywords', content: post.tags.join(', ') });

    // Author
    this.meta.updateTag({ name: 'author', content: post.author });

    // Open Graph tags (Facebook, LinkedIn, etc.)
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:title', content: post.title });
    this.meta.updateTag({ property: 'og:description', content: post.excerpt });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:site_name', content: 'Crianzas Conscientes' });

    // Article specific OG tags
    this.meta.updateTag({ property: 'article:published_time', content: post.publishedDate.toISOString() });
    this.meta.updateTag({ property: 'article:author', content: post.author });
    this.meta.updateTag({ property: 'article:section', content: post.category });
    post.tags.forEach(tag => {
      this.meta.updateTag({ property: 'article:tag', content: tag });
    });

    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: post.title });
    this.meta.updateTag({ name: 'twitter:description', content: post.excerpt });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });

    // Canonical URL
    this.meta.updateTag({ rel: 'canonical', href: url });
  }

  /**
   * Agrega Structured Data (JSON-LD) para SEO
   */
  private addStructuredData(post: BlogPost) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Remove existing script if any
    const existingScript = this.document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    const url = `https://www.mailensteinbrenner.com/blog/${post.slug}`;
    const imageUrl = post.imageUrl.startsWith('http')
      ? post.imageUrl
      : `https://www.mailensteinbrenner.com${post.imageUrl}`;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: imageUrl,
      author: {
        '@type': 'Person',
        name: post.author,
        url: 'https://www.mailensteinbrenner.com/quien-soy'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Crianzas Conscientes',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.mailensteinbrenner.com/logo.png'
        }
      },
      datePublished: post.publishedDate.toISOString(),
      dateModified: post.updatedDate ? post.updatedDate.toISOString() : post.publishedDate.toISOString(),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url
      },
      keywords: post.tags.join(', '),
      articleSection: post.category,
      wordCount: this.estimateWordCount(post.content),
      timeRequired: `PT${post.readingTime}M`,
      inLanguage: 'es-ES'
    };

    const script = this.document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    this.document.head.appendChild(script);
  }

  /**
   * Estima el número de palabras en el contenido
   */
  private estimateWordCount(content: string): number {
    return content.split(/\s+/).length;
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
