import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  /**
   * Track custom event
   */
  trackEvent(eventName: string, eventParams?: { [key: string]: any }) {
    // Solo trackear si analytics está habilitado (producción)
    if (!environment.analytics.enabled) {
      console.log('🔧 [DEV MODE] Analytics disabled - Event would be tracked:', eventName, eventParams);
      return;
    }

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, eventParams);
      console.log('📊 Event tracked:', eventName, eventParams);
    }
  }

  /**
   * Track page view
   */
  trackPageView(url: string) {
    if (!environment.analytics.enabled) {
      console.log('🔧 [DEV MODE] Page view would be tracked:', url);
      return;
    }

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: url
      });
    }
  }

  // Specific event trackers

  /**
   * Track guide download
   */
  trackGuideDownload(guideName: string = 'Límites con amor') {
    this.trackEvent('download_guide', {
      guide_name: guideName,
      category: 'engagement',
      label: 'Free Guide Download'
    });
  }

  /**
   * Track session booking
   */
  trackSessionBooking(source: string = 'unknown') {
    this.trackEvent('book_session', {
      source: source,
      category: 'conversion',
      label: 'Session Booking Click'
    });
  }

  /**
   * Track ebook purchase intent
   */
  trackEbookPurchase(ebookName: string = 'Guía práctica crianza consciente') {
    this.trackEvent('ebook_purchase_intent', {
      ebook_name: ebookName,
      category: 'conversion',
      label: 'Ebook Purchase Click',
      value: 5 // Precio en euros
    });
  }

  /**
   * Track contact form submission
   */
  trackContactForm(subject: string) {
    this.trackEvent('contact_form_submit', {
      subject: subject,
      category: 'conversion',
      label: 'Contact Form Submission'
    });
  }

  /**
   * Track social media click
   */
  trackSocialClick(platform: string) {
    this.trackEvent('social_click', {
      platform: platform,
      category: 'engagement',
      label: `${platform} Click`
    });
  }

  /**
   * Track blog post view
   */
  trackBlogPostView(postSlug: string, postTitle: string) {
    this.trackEvent('blog_post_view', {
      post_slug: postSlug,
      post_title: postTitle,
      category: 'engagement',
      label: 'Blog Post View'
    });
  }

  /**
   * Track resource view
   */
  trackResourceView(resourceName: string) {
    this.trackEvent('resource_view', {
      resource_name: resourceName,
      category: 'engagement',
      label: 'Resource Page View'
    });
  }

  /**
   * Track CTA button click (Call To Action)
   */
  trackCtaClick(ctaName: string, source: string, destination: string) {
    this.trackEvent('cta_click', {
      cta_name: ctaName,
      source_page: source,
      destination: destination,
      category: 'engagement',
      label: 'CTA Click'
    });
  }
}
